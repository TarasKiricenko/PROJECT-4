# Generated by Django 3.2.5 on 2021-07-22 13:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='image',
            field=models.URLField(blank=True, max_length=500),
        ),
    ]
