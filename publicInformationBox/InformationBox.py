##This Code Sets up a Motion Detection System using a PIR Motion Detector, Raspberry Pi Camera Module
##And LED light. It both takes a video for 10 seconds when motion is detected and then snaps a photo
##After the video is taken. The photo is sent to my email address (address and password scrubbed for 
##Posting on Github) The video is saved to a H.264 file on the Pi with its timestamp as the file name.
## I used three different tutorials to test out various parts of this code and ended up using a combo
## Of all 3, recreating the idea with my own functions, variables, and added functionality
## Tutorial Links:
##https://www.raspberrypi.org/learning/parent-detector/worksheet/
##http://www.instructables.com/id/Raspberry-Pi-Motion-Sensitive-Camera/?ALLSTEPS#intro
##https://diyhacking.com/raspberry-pi-gpio-control/

##Camera, Time & GPIO Imports

from picamera import PiCamera
import RPi.GPIO as GPIO
import time

##Email Setup Imports
import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText
from email.mime.image import MIMEImage

##Email Variables
toaddr = "******************"
subject = "Public Information Alert" 
fromaddr = "***************"
msg = MIMEMultipart()
msg['From'] = fromaddr
msg['To'] = toaddr
msg['Subject'] = subject
body = "Alert! Someone stopped by to get information\n\nSee who it is!"

##Setup the GPIO pins
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(2, GPIO.OUT)
GPIO.setup(4, GPIO.IN)

##Setup the Camera
camera = PiCamera()

##set Variables for functions
waitTime = 10
localDirectory = "/home/pi/Desktop/motionDetect/capturedVideo/"
intruderImage = "/home/pi/Desktop/motionDetect/capturedImages/intruder.jpg"
recordingTime = 10

##Function to generate saved video filename with timestamp
def generateFileName():
        return time.strftime("%Y-%m-%d-%H-%M-%S-%Z", time.localtime())


def recordVideo(file_name, rec_time):
	#camera.annotate_text = "Current Time: " + "%04d-%02d-%02d-%02d:%02d:%02d" % (time.year, time.month, time.day, time.hour, time.minute, time.second)
	camera.start_recording(file_name)
	print "Video recording started"
	camera.wait_recording(rec_time)
	camera.stop_recording()
	print "Video recording stopped."
	camera.capture(intruderImage)
	sendEmail();
	time.sleep(5)
    

def sendEmail():
	msg.attach(MIMEText(body, 'plain'))
    msg.attach(MIMEImage(file(intruderImage).read()))
	server = smtplib.SMTP('smtp.gmail.com',587)
	server.starttls()
	server.login(fromaddr, "***********")
	text = msg.as_string()
	server.sendmail(fromaddr,toaddr,text)
	server.quit()
	print "Email Sent"
	


##Function to check for Motion
def motionDetected():
        fname = localDirectory + generateFileName()
	fname = fname + ".h264"
	recordVideo(fname, recordingTime)
	

##Loop to Run the Whole Thing
## If PIR Sensor reads 0 (off, low) show no motion
## If PIR Sensor reads 1 (on, high) show motion, run
## motionDetected Function which starts recordVideo 
## function and sends email letting me know I have captured motion
while True:
	i=GPIO.input(4)
	if i==0:
		print("No motion detected")
		GPIO.output(2,0) #Turn Off LED
		time.sleep(0.1)
	elif i==1:
                print "Motion was detected!"
		GPIO.output(2,1) #Turn on the LED
                motionDetected()
		time.sleep(0.1)
