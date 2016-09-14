#This script uses IMAP to allow users to select different folders
#From Gmail and check their most recent message
#It takes inputs selecting for Inbox, Sent, Drafts
#And New or All mail
#It also returns how many email messages are in the particular folder
#I used and modified a walkthrough of IMAP from https://yuji.wordpress.com/2011/06/22/python-imaplib-imap-example-with-gmail/

# We will use IMAP for this to retrieve mail
import imaplib #import the library
mail = imaplib.IMAP4_SSL('imap.gmail.com') #set mail variable/object equal to this
mail.login('config.email', 'config.password') #set these for login field of mail object
mail.list()
#Out: list of "folders" aka labels in gmail

#Allow user to pick folder by picking 1 for inbox, 2 for sent, 3 for Drafts
pickFolder = raw_input("Which Folder do you want to search for? \n\n 1 is Inbox, 2 is Sent, 3 is Drafts")

#Change selectedFolder variable to string for passing to mail.select function
#Default is Inbox if they mess up
if pickFolder ==1:
	selectedFolder = "inbox"
elif pickFolder ==2:
	selectedFolder = "sent"
elif pickFolder ==3:
	selectedFolder = "drafts"
else:
	selectedFolder = "inbox"

#Let users either pick all mail, or just new mail by selecting 1 or 2
whatSee = raw_input("Which mail do you want to see? \n\n 1 is All Mail, 2 is New Mail")

#Create variabel see and pass it the string that needs to go in the mail.search function
if whatSee ==1:
	see = "UNSEEN"
elif whatSee == 2:
	see = "All"
else: 
	see = "All"

# Getting All Our Email and Fetching Most Recent

result, data = mail.search(None, see) #create result, variable and get from mail.search
ids = data[0] #data is a list we need to pick most current in
id_list = ids.split() #function to separate ids in space separated string
latest_email_id = id_list[-1] # correct for array, get latest email
result, data = mail.fetch(latest_email_id, "(RFC822)") #fetch the email body, known as (RFC822) for given ID
raw_email = data[0][1] 

#modified below script from 
#http://www.vineetdhanawat.com/blog/2012/06/how-to-extract-email-gmail-contents-as-text-using-imaplib-via-imap-in-python-3/
#To get the body as characters, original example was to save as a file

import email # library for cleaning up email messages
# converts byte literal to string removing b''
raw_email_string = raw_email.decode('utf-8')
email_message = email.message_from_string(raw_email_string)

#Print Stuff to Terminal
print "Your latest message in: " + selectedFolder + ":" + see + "\n"
print "This is the to: " + str(email_message['To'] + "\n")
print "This is the from: " + str(email.utils.parseaddr(email_message['From'])) # for parsing 
print "\nThis is the subject: " + email_message['Subject'] + "\n"

# this will loop through all the available multiparts in mail
for part in email_message.walk():
	if part.get_content_type() == "text/plain": # ignore attachments/html
  		body = part.get_payload(decode=True)
  		print "This is the body: " + body.decode('utf-8') +"\n"
	else:
		continue

# print email_message.items() # print all headers

length = len(id_list) #This works, Check How many unr
print "There are " + str(length) + " email messages in: " + selectedFolder +":" + see + "."
# if length > 10:
# 	print "Cool Cat! You have more than 10 new emails."

# # Get Just the Body Text?


#if you want text content(body) and email has many headers
#(plaintext/html), we must parse each message separately
# need to use something like following to do this, from stackoverflow

# def get_first_text_block(self, email_message_instance):
# 	maintype = email_message_instance.get_content_maintype()
# 	if maintype == 'multipart':
# 		for part in email_message_instance.get_payload():
# 			if part.get_content_maintype() == 'text':
# 				return part.get_payload()
# 				# print part.get_payload()
# 	elif maintype == 'text':
# 		return email_message_instance.get_payload()




