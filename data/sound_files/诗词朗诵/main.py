from pydub import AudioSegment
import codecs

filename = './'+'苏幕遮 碧云天-范仲淹'
mp3 = AudioSegment.from_wav(filename+'.wav') # 打开mp3文件
mp3[17*1000+500:].export(filename+'1'+'.wav', format="mp3") # 切割前17.5秒并覆盖保存