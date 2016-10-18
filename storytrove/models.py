from django.db import models
from django.conf import settings
from django.contrib.auth.models import User


class TroveObjectManager(models.Manager):
    def create_trove_object(self, trove_id, description):
        trove_object = self.create(trove_id=trove_id, description=description)
        return trove_object


class PromptManager(models.Manager):
    def create_prompt(self, trove_objects, tags):
        prompt = self.create(trove_objects=trove_objects, tags=tags)
        return prompt


class ResponseManager(models.Manager):
    def create_response(self, user, prompt, title, date, text, is_private, is_draft):
        response = self.create(user=user, prompt=prompt, title=title, date=date, text=text, is_private=is_private,
                               is_draft=is_draft)
        return response


class CommentManager(models.Manager):
    def create_comment(self, user, response, date, text):
        comment = self.create(user=user, response=response, date=date, text=text)
        return comment


class EmojiResponseOnResponseManager(models.Manager):
    def create_emoji_on_response(self, user, response, emoji):
        emojiResponse = self.create(user=user, response=response, emoji=emoji)
        return emojiResponse


class EmojiResponseOnCommentManager(models.Manager):
    def create_emoji_on_comment(self, user, comment, emoji):
        emojiComment = self.create(user=user, comment=comment, emoji=emoji)
        return emojiComment


class AchievementManager(models.Manager):
    def create_achievement(self, name, rank, description):
        achievement = self.create(name=name, rank=rank, description=description)
        return achievement


class TroveObject(models.Model):
    trove_id = models.CharField(max_length=20)  # this could actually be an int field
    description = models.TextField()

    objects = TroveObjectManager()


class Prompt(models.Model):
    trove_objects = models.ManyToManyField(TroveObject)  # this is the list of trove ids used as stimuli
    tags = models.CharField(max_length=50)

    objects = PromptManager()


class Response(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    prompt = models.ForeignKey(Prompt, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    date = models.DateTimeField()
    text = models.TextField()  # attempted no maximum length
    is_private = models.BooleanField()
    is_draft = models.BooleanField()

    objects = ResponseManager()


class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    response = models.ForeignKey(Response, on_delete=models.CASCADE)
    date = models.DateTimeField()
    text = models.TextField()  # attempted no maximum length

    objects = CommentManager()


class EmojiResponseOnResponse(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    response = models.ForeignKey(Response, on_delete=models.CASCADE)

    EMOJI_RESPONSES = (
        ('+', ':thumbsup:'),
        ('-', ':thumbsdown:'),
        ('1', ':grinning:'),
        ('2', ':cry:'),
        ('3', ':laughing:'),
        ('4', ':scream:'),
        ('5', ':thinking:')
    )
    emoji = models.CharField(max_length=1, choices=EMOJI_RESPONSES)

    objects = EmojiResponseOnResponseManager()


class EmojiResponseOnComment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)

    EMOJI_RESPONSES = (
        ('+', ':thumbsup:'),
        ('-', ':thumbsdown:'),
        ('1', ':grinning:'),
        ('2', ':cry:'),
        ('3', ':laughing:'),
        ('4', ':scream:'),
        ('5', ':thinking:')
    )
    emoji = models.CharField(max_length=1, choices=EMOJI_RESPONSES)
    objects = EmojiResponseOnCommentManager()


class Achievement(models.Model):
    user = models.ManyToManyField(settings.AUTH_USER_MODEL)
    name = models.CharField(max_length=50)
    rank = models.IntegerField()  # bronze, silver, gold
    date = models.DateTimeField()
    description = models.TextField()
    objects = AchievementManager()
