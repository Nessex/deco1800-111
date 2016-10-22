from storytrove.models import *
from django.contrib.auth.models import  User

import datetime
from django.utils import timezone
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Set up User references
""" At this stage we simply create some example users in django.contrib.auth,
    and then use them for the rest of the example data """
USER_ONE = User.objects.create_user('Jonathan', 'jonathan.holland8@gmail.com', '123456789')
USER_TWO = User.objects.create_user('Nathan', 'nathan.realemail@email.com', '123456789')

USER_ONE.save()
USER_TWO.save()

# Create Trove Objects
TroveObject1 = TroveObject.objects.create_trove_object('137268923', "River Red Gums (Eucalyptus Camaldulensis)")
TroveObject2 = TroveObject.objects.create_trove_object('234844423', "The Raymond Dinner Menu, March 11, 1917, Pasadena, California")

TroveObject1.save()
TroveObject2.save()

# Create Prompts
Prompt1 = Prompt.objects.create_prompt("war")
Prompt1.save()
Prompt1.trove_objects.add(TroveObject1)

Prompt2 = Prompt.objects.create_prompt("death")
Prompt2.save()
Prompt2.trove_objects.add(TroveObject2)

# Set up Response texts
ResponseTitle1 = "Old Dave"
ResponseText1 = open(BASE_DIR + './examples/response1.txt','r').read()
ResponseTitle2 = "Gone Mad"
ResponseText2 = open(BASE_DIR + './examples/response2.txt','r').read()

# Create Responses
Response1 = Response.objects.create_response(USER_ONE, Prompt1, ResponseTitle1, timezone.now(),ResponseText1, False, False)
Response2 = Response.objects.create_response(USER_TWO, Prompt2, ResponseTitle2, timezone.now(),ResponseText2, False, False)

Response1.save()
Response2.save()

# Set up Comment texts
CommentText1  = open(BASE_DIR + './examples/comment1.txt','r').read()
CommentText2  = open(BASE_DIR + './examples/comment2.txt','r').read()

# Create Comments
Comment1 = Comment.objects.create_comment(USER_ONE, Response2, timezone.now(), CommentText1)
Comment2 = Comment.objects.create_comment(USER_TWO, Response1, timezone.now(), CommentText2)

Comment1.save()
Comment2.save()

# Create Achievements - this does not mean a user has achieved it
Achievement1 = Achievement.objects.create_achievement("Sign up to StoryTrove!",0,"This achievement is just to get you started and is awarded when you create your account!")
Achievement2 = Achievement.objects.create_achievement("Make your first Story",1,"This achievement is awarded when you first post a response to a Trove visual prompt.")

Achievement1.save()
Achievement2.save()

# Make a user achieve achievements
Achievement1.user.add(USER_ONE)
Achievement1.user.add(USER_TWO)
Achievement2.user.add(USER_ONE)

# Create Reactions/Votes
EmojiResponse1 = EmojiResponseOnResponse.objects.create_emoji_on_response(USER_ONE,Response2,'+')
EmojiResponse2 = EmojiResponseOnResponse.objects.create_emoji_on_response(USER_TWO,Response1,'2')

EmojiComment1 = EmojiResponseOnComment.objects.create_emoji_on_comment(USER_ONE,Comment2,'1')
EmojiComment2 = EmojiResponseOnComment.objects.create_emoji_on_comment(USER_ONE,Comment2,'+')
EmojiComment3 = EmojiResponseOnComment.objects.create_emoji_on_comment(USER_TWO,Comment1,'5')

EmojiResponse1.save()
EmojiResponse1.save()

EmojiComment1.save()
EmojiComment2.save()
EmojiComment3.save()
