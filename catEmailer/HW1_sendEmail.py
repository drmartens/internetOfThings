#This email script takes user input for the To: and Subject: of the email.
#It also has the user pick some random numbers that are calculated and filled into the 
#body of the email message
#Finally, one of the numbers selected picks a random cat image to attach to the email for send

import smtplib
from email.MIMEMultipart import MIMEMultipart
from email.MIMEText import MIMEText


#adding import for picture sending
from email.mime.image import MIMEImage


#separate file for storing my password. You can create your own extra py files
#and import them using same method as importing libraries/modules as above
#Can also use Base 64 encoding, but not sure when this is useful b/c still see password
import config

#some variables for use in script, In Python 2, raw_input() returns a string, 
#and input() tries to run the input as a Python expression. My version is 2.7
#This is discontinued in Python 3

print("Welcome to Cat Story! \n\n Please follow the prompts to send your custom story to a friend!")

storyArray = [1, 2, 3, 4, 5]
#imageArray = [1, 2, 3, 4, 5] - Now that we added the story element, get rid of the image array, can just pass it storyArray since they match.
sendTo = raw_input("Who do you want to send this to? (Pick an friend's email address!")
yourName = raw_input("What is your friend's first name?")
number = int(input("Pick a number between 1 and 5 to begin!"))

#The Array to Hold the Questions for the Story. This way only one fires when a number is selected, not all 5!
if number == 1:
	grossFood = raw_input("What is your least favorite food?")
	story = storyArray[number-1]
elif number == 2:
	bestFriend = raw_input("Who is your best friend (aside from the friend you are sending this to ;D )?")
	story = storyArray[number-1]
elif number == 3:
	aKid = raw_input("Name one kid in your life.")
	story = storyArray[number-1]
elif number == 4:
	favFood = raw_input("What is your favorite type of soup? (Just pick one!)")
	story = storyArray[number-1]
elif number == 5:
	yourAward = raw_input("If you could get an award for anything, what would it be for?")
	story = storyArray[number-1]	
else: #tried to go back and reprompt for number, but kept messing up. New solution. Random story. Need to preset all variables above this line.
	print("A wise guy huh? We'll pick one for you!")
	from random import randint
	grossFood = "Ayo's cooking"
	bestFriend = "Luna"
	aKid = "Usagi-chan"
	favFood = "congee"
	yourAward = "not following instructions"
	story =randint(1,5)
	number = story

#We'll Tie the Subject to the Person's Name
subject = "A Story about a Cat named " + yourName + "!"

#Give the bodyMessage a null value until we fill it in a sec.
bodyMessage = None

#Now using the story picked from the story array to power the custom message. We need them to match b/c the custom second input will be included in only the right story.

if story ==1:
	 bodyMessage ="A Story About a Cat \n\n There was once a cat named " + yourName + " who was very sad because they had been served " + grossFood + ". What a drama queen!"  
elif story ==2:
	bodyMessage ="A Story About a Cat \n\n There was once a cat named " + yourName + " who was really an alien from the moon. They rode a fast train with their best friend, " + bestFriend + ", searching for a ditsy teenager destined to become the Moon Princess... one day."
elif story == 3:
	bodyMessage ="A Story About a Cat \n\n There was once a cat named " + yourName + " who was extremely lazy and slept all the time. One day, " + aKid + " jumped on them and woke them up from a nap. They were not happy..." 
elif story == 4: 
	bodyMessage ="A Story About a Cat \n\n There was once a cat named " + yourName + " who loved to eat " + favFood + " soup. But that quickly ended after an impatient gulp that left their mouth scalded and fur on end! Patience is a virtue silly cat!"
elif story == 5:
	bodyMessage ="A Story About a Cat \n\n There was once a cat named " + yourName + " who was very excited because they had just won an award for " + yourAward + "! They kneaded their favorite bag feverishly after celebrating with an ounce of catnip, then fell asleep for 18 hours. What a day!"  
else:
	bodyMessage ="Sorry, your story couldn't be loaded. :("
 
# Now Let's Build the Email message!	
fromaddr = config.email
msg = MIMEMultipart()
msg['Subject'] = subject
msg['From'] = fromaddr
msg['To'] = sendTo
# Attach the body to the email
body = bodyMessage
msg.attach(MIMEText(body, 'plain'))

#Attach image with filename Cat + users picked number + png from same folder as this script
msg.attach(MIMEImage(file("cat" + str(storyArray[number-1]) + ".png").read()))

#Let's Send the Email Now! 
server = smtplib.SMTP('smtp.gmail.com', 587)
# server.ehlo()
server.starttls()
server.login(fromaddr, config.password)
text = msg.as_string()
server.sendmail(fromaddr, sendTo, text)

#Exit the server when done.
server.quit()