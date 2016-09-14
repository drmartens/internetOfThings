Email Check:
===========
For our homework first week, we were tasked to modify our in-class email send script to take user input and have it run calculations within our program and include in the body of the email.

I created a Cat Story Generator that takes user input for:
- Email You Want to Send To
- Friend's Name
- Number Between 1 and 5
- Corresponding follow-up question based on number you select

Cat Story Generator then takes the inputted info and creates a short story based on your responses and attaches a moving (PNG?) of the corresponding image to go with the story. I didn't know PNGs could be animated, but apparently they can!

If the user inputs a number not between 1 and 5 or anything else, a random Cat story is generated for them.

Please note this will not work out of the box. I created a separate config file to hold a username and password, and purposely ****** them out for this. If you want this to work, go to config.py and change the email and password to one that is yours.

I used the SMTP library refernce at https://docs.python.org/2/library/email-examples.html#email-examples to help figure out the images

Cat Images from:
- Luna Crying - http://pin.anime.com/wp-content/uploads/2015/07/Luna-cat-is-sad-sailor-moon-animated-gif.gif
- Cat Kneading Bag - http://s9.favim.com/orig/131210/x27-anime-cat-chi-Favim.com-1133148.gif
- Cat Eating Something Hot - https://media.giphy.com/media/48Eiley8Ox1GU/giphy.gif
- Big Cat Getting Jumpted on By Kitten - https://66.media.tumblr.com/afa77a56f21c9b062156251e20fb3cee/tumblr_nrobrdjOOX1u9ia8fo1_400.gif
- Luna & Artemis on a Train - https://myanimelist.cdn-dena.com/s/common/uploaded_files/1449565712-5aafae0c93dc1277f3b714736537eb1d.gif


Email Check:
=======
Node.js
For this project I built a node.js program that takes user input allowing users to select which mailbox they want to view: Sent, Starred, Important, Drafts, or Inbox by selecting 1-5.
It then used the "prompt" module to allow them to select a range of email they want to view: 1 being the newest and the second number being the oldesst (so 1 and 5 would show the first 5 newest emails, 10 - 15 would show the 10th oldest - the 15th oldest.
It then fetches the date, from, and to of the email and prints to terminal.
I used a tutorial from imap library on github by mscdex from https://github.com/mscdex/node-imap to start and modified it


Python
This python script uses the IMAP protocol to fetch a users most recent message from Gmail. It allows the user to select whether they want to check the Inbox, Sent Mail, or Drafts and then asks if they only want to see unseen mail, or if they want to see all mail. 
It also uses the Email library to clean up the message and fetch the body of the email and convert it to plaintext.
It also returns how many email messages their are in that particular folder.
Like the sendEmail program, it sources the username and password from a separate config file.
I used a walkthrough of the IMAP library for Python at https://yuji.wordpress.com/2011/06/22/python-imaplib-imap-example-with-gmail/ for reference and modified.

