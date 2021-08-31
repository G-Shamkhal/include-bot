#from config import config
import discord
from discord import client
from discord.ext import commands
from discord.ext.commands import CommandNotFound
from discord.errors import Forbidden
from discord.utils import get
import json
import os
import random
import asyncio
from async_timeout import timeout
import functools
import itertools
import math
import sys
import requests
import inspect
import googleapiclient.discovery
from googletrans import Translator
from google_trans_new import google_translator
from google.cloud import translate
import youtube_dl
from ffmpy import FFmpeg

token = os.environ['token']
prefix = os.environ['prefix']
searchID = os.environ['searchID']
api_key = os.environ['api_key']

#token = config['token']
#prefix = config['prefix']
#searchID = config['searchID']
#api_key = config['api_key']

import functions






