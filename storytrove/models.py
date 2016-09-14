from django.db import models

class UserAccount(models.Model):
    username = models.CharField(max_length = 15)
    password = models.CharField(max_length = 15)
    image = models.CharField(max_length = 255)
    email_address = models.CharField(max_length = 50)
    last_login = models.DateField(default = datetime.now)
    create_date = models.DateField(default = datetime.now)
	
	objects = UserAccountManager()
	
class UserAccountManager(models.Manager):
	def create_user_account(self, username, password, image, email_address):
		user = self.create(username=username,password=password,image=image,email_address=email_address)
		return user
	
class TroveObject(models.Model):
    trove_id = models.CharField(max_length = 20) # this could actually be an int field
    description = models.TextField()
	
	objects = TroveObjectManager()
	
class TroveObjectManager(models.Manager):
	def create_trove_object(self, trove_id, description):
		trove_object = self.create(trove_id=trove_id,description=description)
		return trove_object
		
class Prompt(models.Model):
    trove_objects = models.ManyToManyField(TroveObject)  #this is the list of trove ids used as stimuli
    tags = models.CharField(max_length = 50)
	
	objects = PromptManager()
	
class PromptManager(models.Manager):
	def create_prompt(self, trove_objects, tags):
		prompt = self.create(trove_objects=trove_objects,tags=tags)
		return prompt

class Response(models.Model):
    user = models.ForeignKey(UserAccount, on_delete = models.CASCADE)
    prompt = models.ForeignKey(Prompt, on_delete = models.CASCADE)
    title = models.CharField(max_length = 100)
    date = models.DateField()
    text = models.TextField() #attempted no maximum length
    is_private = models.BooleanField()
    is_draft = models.BooleanField()
	
	objects = ResponseManager()

class ResponseManager(models.Manager):
	def create_response(self, user, prompt, title, date, text, is_private, is_draft):
		response = self.create(user=user,prompt=prompt,title=title,date=date,text=text,
								is_private=is_private,is_draft=is_draft)
		return response
	
class Comment(models.Model):
    user = models.ForeignKey(UserAccount, on_delete = models.CASCADE)
    response = models.ForeignKey(Response, on_delete = models.CASCADE)
    date = models.DateField()
    text = models.TextField() #attempted no maximum length
	
	objects = CommentManager()
	
class CommentManager(models.Manager):
	def create_comment(self, user, response, date, text):
		comment = self.create(user=user,response=response,date=date,text=text)
		return comment

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
	
	objects = EmojiResponseOnResponseManager()

class EmojiResponseOnResponseManager(models.Manager):
	def create_emoji_on_response(self, user, response, emoji):
		emojiResponse = self.create(user=user,response=response,emoji=emoji)
		return emojiResponse
	
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
	
	objects = EmojiResponseOnCommentManager()
	
class EmojiResponseOnCommentManager(models.Manager):
	def create_emoji_on_comment(self, user, comment, emoji):
		emojiComment = self.create(user=user,comment=comment,emoji=emoji)
		return emojiComment
	
class Achievement(models.Model):
	user = models.ManyToManyField(UserAccount, blank = True)
	name = models.CharField(max_length = 50)
	rank = models.IntegerField() #bronze, silver, gold
	description = models.TextField()
	
	objects = AchievementManager()
	
class AchievementManager(models.Manager):
	def create_achievement(self, name, rank, description):
        achievement = self.create(name=name,rank=rank,description=description)
        return achievement