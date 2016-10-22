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
TroveObject1 = TroveObject.objects.create_trove_object('209660950', "Felton Bequest, 1946")
TroveObject2 = TroveObject.objects.create_trove_object('7466787', "1933. Two pantomine players, Mr J. Stocks and Mr harry Freeman (King and Queen) at the Urban District Council tenants annual gala.")
TroveObject3 = TroveObject.objects.create_trove_object('13294658', "Glen Gala House")
TroveObject4 = TroveObject.objects.create_trove_object('212481846', "Gala Cinema owner, Harry Waghorn in the projection room, 4 January 1988.")
TroveObject5 = TroveObject.objects.create_trove_object('192301041', "Stanley, Tasmania, Australia")
TroveObject6 = TroveObject.objects.create_trove_object('192305936', "Hobart, Tasmania, Australia")
TroveObject7 = TroveObject.objects.create_trove_object('207535485', "Child's brown school case made of composite fibre by Duro Travel Goods, circa 1953-1965. The case has two names written on it: Jennifer Andison, crossed out and replaced with Bruce Andison. The Andison family lived in Lane Cove, Sydney until 1964. This school case was handed down to Bruce from his sister Jennifer. In 1964 the family moved to Melbourne where Bruce attended Veterinary School graduating in 1973. He then entered Medical School graduating in 1980, trained as an Obstetrician and Gynecologist and moved to the USA. Duro Travel Goods Ltd was registered in 1953 (according to the Companies Index held in the Queensland Archives); its name was delisted in 1983. Child's brown school case made of composite fibre, reinforced with metal edges and fibre corners and a wooden frame inside the lid. The case has a plastic carry handle and locks on either side. On the outside of the case, underneath the handle, are the initials \"B.A.\" in large lettering in silver paint. Inside the lid of the case is written \"IB 3542/​BRUCE ANDISON (\"Jennifer Andison\" crossed out) /​591/​Mowbray Rd/​Lane Cove\" Also inside is a small paper label which reads \"VULCANISED FIBRE/​MADE BY/​DURO/​TRAVEL GOODS LTD/​SYDNEY N.S.W.\"")
TroveObject8 = TroveObject.objects.create_trove_object('16124264', "Office staff at World Travel Headquarters working on a Swingaway holiday promotion")
TroveObject9 = TroveObject.objects.create_trove_object('210527547', "0G2A3940-2 Travellers travel photobook")


TroveObject1.save()
TroveObject2.save()

# Create Prompts
Prompt1 = Prompt.objects.create_prompt("war")
Prompt1.save()
Prompt1.trove_objects.add(TroveObject1)
Prompt1.trove_objects.add(TroveObject4)
Prompt1.trove_objects.add(TroveObject7)

Prompt2 = Prompt.objects.create_prompt("death")
Prompt2.save()
Prompt2.trove_objects.add(TroveObject2)
Prompt2.trove_objects.add(TroveObject5)
Prompt2.trove_objects.add(TroveObject8)

Prompt2 = Prompt.objects.create_prompt("death")
Prompt2.save()
Prompt2.trove_objects.add(TroveObject3)
Prompt2.trove_objects.add(TroveObject6)
Prompt2.trove_objects.add(TroveObject9)

# Set up Response texts
ResponseTitle1 = "Old Dave"
ResponseText1 = open(os.path.join(BASE_DIR, 'storytrove', 'examples', 'response1.txt'),'r').read()
ResponseTitle2 = "Gone Mad"
ResponseText2 = open(os.path.join(BASE_DIR, 'storytrove', 'examples', 'response2.txt'),'r').read()

# Create Responses
Response1 = Response.objects.create_response(USER_ONE, Prompt1, ResponseTitle1, timezone.now(),ResponseText1, False, False)
Response2 = Response.objects.create_response(USER_TWO, Prompt2, ResponseTitle2, timezone.now(),ResponseText2, False, False)

Response1.save()
Response2.save()

# Set up Comment texts
CommentText1  = open(os.path.join(BASE_DIR, 'storytrove', 'examples', 'comment1.txt'),'r').read()
CommentText2  = open(os.path.join(BASE_DIR, 'storytrove', 'examples', 'comment2.txt'),'r').read()

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
