import os
import linecache
import codecs
import time
import re
import json

file_path = '../data/诗人迁移路线/'
path_list = []

for i in os.walk(file_path):
    files = i[2]
    f = open('../data/path.json', 'w', encoding = 'utf-8')    
    for j in range(len(files)):
        isFirst = True
        pathMode = False
        print(files[j])
        content = linecache.getlines(file_path+files[j])
        path = []
        for line in content:
            line = line.rstrip('\n')
            print(line)            
            if isFirst:
                author_name = re.search('.*?(?=[\(（])', line).group(0)
                isFirst = False
                continue
            elif len(line)==0:
                continue
            elif line[-1]=='岁':
                pathMode = True
                time = line
                continue
            elif pathMode:
                path.append({'time': time, 'route': line.split(' → ')})# e.g."29-30": ['冠县', '聊城', '惠民', '大名']
                pathMode = False
                continue
        path_list.append({
            'name': author_name,
            'path': path
        }) 
    json.dump(path_list, f, ensure_ascii = False, indent=4)
    f.close()
    
