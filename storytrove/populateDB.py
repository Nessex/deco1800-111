from storytrove.models import *
from django.contrib.auth.models import  User

# Set up User references
USER_ONE = User.objects.get(firstname="")
USER_TWO = User.objects.get(firstname="")

# Create Trove Objects
TroveObject1 = TroveObject.objects.create_trove_object('137268923', "River Red Gums (Eucalyptus Camaldulensis)")
TroveObject1.save()
TroveObject2 = TroveObject.objects.create_trove_object('234844423', "The Raymond Dinner Menu, March 11, 1917, Pasadena, California")
TroveObject2.save()

# Create Prompts
Prompt1 = Prompt.objects.create_prompt([TroveObject1],"war")
Prompt2 = Prompt.objects.create_prompt([TroveObject2], "death")

# Set up Response texts
ResponseTitle1 = "Old Dave"
ResponseText1 = open('examples/response1','r').read()
ResponseTitle2 = "Gone Mad"
ResponseText2 = open('examples/response2','r').read()

# Create Responses
Response1 = Response.objects.create_response(USER_ONE, Prompt1, ResponseTitle1, timezone.now(),ResponseText1, False, False)
Response1.save()
Response2 = Response.objects.create_response(USER_TWO, Prompt2, ResponseTitle2, timezone.now(),ResponseText2, False, False)
Response2.save()

# Set up Comment texts
CommentText1  = open('examples/comment1','r').read()
CommentText2  = open('examples/comment2','r').read()

# Create Comments
Comment1 = Comment.objects.create_comment(USER_ONE, Response2, timezone.now(), CommentText1)
Comment1.save()
Comment2 = Comment.objects.create_comment(USER_TWO, Response1, timezone.now(), CommentText2)
Comment2.save()

# Create Achievements - this does not mean a user has achieved it
Achievement1 = Achievement.objects.create_achievement("Sign up to StoryTrove!",0,"This achievement is just to get you started and is awarded when you create your account!")
Achievement1.save()
Achievement2 = Achievement.objects.create_achievement("Make your first Story",1,"This achievement is awarded when you first post a response to a Trove visual prompt.")
Achievement2.save()

# Make a user achieve achievements
Achievement1.user.add(USER_ONE)
Achievement1.user.add(USER_TWO)
Achievement2.user.add(USER_ONE)

# Create Reactions/Votes
emojiResponse1 = EmojiResponseOnResponse.objects.create_emoji_on_response(USER_ONE,Response2,'+')
emojiResponse2 = EmojiResponseOnResponse.objects.create_emoji_on_response(USER_TWO,Response1,'2')

emojiComment1 = EmojiResponseOnComment.objects.create_emoji_on_comment(USER_ONE,Comment2,'1')
emojiComment2 = EmojiResponseOnComment.objects.create_emoji_on_comment(USER_ONE,Comment2,'+')
emojiComment3 = EmojiResponseOnComment.objects.create_emoji_on_comment(USER_TWO,Comment1,'5')