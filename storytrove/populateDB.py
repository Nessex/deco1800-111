from storytrove.models import *
from django.contrib.auth.models import  User

# Set up User references
USER_ONE = User.objects.get(firstname="")
USER_TWO = User.objects.get(firstname="")

# Create Trove Objects
TroveObject1 = TroveObject.objects.create_trove_object('', "")
TroveObject2 = TroveObject.objects.create_trove_object('', "")

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

# Create Achievements


# Create Reactions/Votes
