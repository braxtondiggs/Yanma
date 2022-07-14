ffmpeg -i temp.mp4 -i overlay.png -filter_complex "overlay=10:10" '.$graphicsPath.'/graphic.mp4
ffmpeg -f concat -i list.txt -i audio.mp3 -c:v libx264 -c:a aac -shortest -pix_fmt yuv420p -r 30 -g 60 -b:v 2500k -acodec libmp3lame -ar 44100 -threads 6 -qscale 3 -b:a 712000 -maxrate 800k -bufsize 1400k -f flv rtmp://a.rtmp.youtube.com/live2/3x5k-dfy6-w1uw-76ww-eax4