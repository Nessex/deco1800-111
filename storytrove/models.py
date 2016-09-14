from django.db import models

class UserAccount(models.Model):
    username = models.CharField(max_length = 15)
    password = models.CharField(max_length = 15)
    image = models.CharField(max_length = 255)
    email_address = models.CharField(max_length = 50)
    last_login = models.DateField()
    create_date = models.DateField()

class TroveObject(models.Model):
    trove_id = models.CharField(max_length = 20) # this could actually be an int field
    description = models.TextField()

class Prompt(models.Model):
    trove_objects = models.ManyToManyField(TroveObject)  #this is the list of trove ids used as stimuli
    tags = models.CharField(max_length = 50)

class Response(models.Model):
    user = models.ForeignKey(UserAccount, on_delete = models.CASCADE)
    prompt = models.ForeignKey(Prompt, on_delete = models.CASCADE)
    title = models.CharField(max_length = 100)
    date = models.DateField()
    text = models.TextField() #attempted no maximum length
    is_private = models.BooleanField()
    is_draft = models.BooleanField()

class Comment(models.Model):
    user = models.ForeignKey(UserAccount, on_delete = models.CASCADE)
    response = models.ForeignKey(Response, on_delete = models.CASCADE)
    date = models.DateField()
    text = models.TextField() #attempted no maximum length

class EmojiResponseOnResponse(models.Model):
    user = models.ForeignKey(UserAccount, on_delete = models.CASCADE)
    response = models.ForeignKey(Response, on_delete = models.CASCADE)

    EMOJI_RESPONSES = (
        ('+', ':thumbsup:'),
        ('-', ':thumbsdown:'),
        ('1', ':grinning:'),
        ('2', ':cry:'),
        ('3', ':laughing:'),
        ('4', ':scream:'),
        ('5', ':thinking:')
    )
    emoji = models.CharField(max_length = 1, choices = EMOJI_RESPONSES)

class EmojiResponseOnComment(models.Model):
    user = models.ForeignKey(UserAccount, on_delete = models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete = models.CASCADE)

    EMOJI_RESPONSES = (
        ('+', ':thumbsup:'),
        ('-', ':thumbsdown:'),
        ('1', ':grinning:'),
        ('2', ':cry:'),
        ('3', ':laughing:'),
        ('4', ':scream:'),
        ('5', ':thinking:')
    )
    emoji = models.CharField(max_length = 1, choices = EMOJI_RESPONSES)
	
class Achievement(models.Model):
	user = models.ForeignKey(UserAccount, on = models.CASCADE)
	name = models.CharField(max_length = 50)
	rank = models.IntegerField() #bronze, silver, gold
	description = models.TextField()