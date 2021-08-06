from modules import *

async def send(message, author, heading, description, color):
    embed = discord.Embed(colour = color, title=heading, description = description)
    embed.set_author(name=author)
    await message.channel.send(embed = embed)

async def img(self, message, args):
    ran = random.randint(0, 9)
    resource = googleapiclient.discovery.build("customsearch", "v1", developerKey=config['api_key']).cse()
    result = resource.list(
        q=f"{args[1]}", cx=config['searchID'], searchType="image"
    ).execute()
    url = result["items"][ran]["link"]
    embed = discord.Embed(colour = 0xff9900, title=f"Вот ваше изображение ({args[1].title()})")
    embed.set_image(url=url)
    await message.channel.send(embed = embed)

async def hi(self, message, args):
    await message.channel.send(message.author.mention + ' Привет!')

async def quote(self, message, args):
    response = requests.get("https://zenquotes.io/api/random")
    json_data = json.loads(response.text)
    
    quote = [json_data[0]['a'], json_data[0]['q']]

    translator = Translator()
    translate = translator.translate(quote[1], dest='ru')

    quote[1] = "EN: " + quote[1] + "\n\n" "RU: " + translate.text

    await send(message, "Цитата", quote[0], quote[1], 0x00BFFF)

ytdl_format_options = {
    'format': 'bestaudio/best',
    'outtmpl': '%(extractor)s-%(id)s-%(title)s.%(ext)s',
    'restrictfilenames': True,
    'noplaylist': True,
    'nocheckcertificate': True,
    'ignoreerrors': False,
    'logtostderr': False,
    'quiet': True,
    'no_warnings': True,
    'default_search': 'auto',
    'source_address': '0.0.0.0' # bind to ipv4 since ipv6 addresses cause issues sometimes
}

ffmpeg_options = {
    'options': '-vn'
}

ytdl = youtube_dl.YoutubeDL(ytdl_format_options)

class YTDLSource(discord.PCMVolumeTransformer):
    def __init__(self, source, *, data, volume=0.5):
        super().__init__(source, volume)

        self.data = data

        self.title = data.get('title')
        self.url = data.get('url')

    @classmethod
    async def from_url(cls, url, *, loop=None, stream=False):
        loop = loop or asyncio.get_event_loop()
        data = await loop.run_in_executor(None, lambda: ytdl.extract_info(url, download=not stream))

        if 'entries' in data:
            # take first item from a playlist
            data = data['entries'][0]

        filename = data['url'] if stream else ytdl.prepare_filename(data)
        return cls(discord.FFmpegPCMAudio(filename, **ffmpeg_options), data=data)

async def yt(self, ctx, url):
    """Plays from a url (almost anything youtube_dl supports)"""

    async with ctx.channel.typing():
        player = await YTDLSource.from_url(url[1], loop=self.loop, stream=True)
        #ctx.guild.voice_client.play(player, after=lambda e: print('Player error: %s' % e) if e else None)

        guild = ctx.guild
        voice_client = discord.VoiceClient = discord.utils.get(self.voice_clients, guild=guild)
        
        voice_client.play(player, after=None)
    await ctx.send('Now playing: {}'.format(player.title))

methods = [name for (name , obj) in vars().items() if hasattr(obj, "__class__") and obj.__class__.__name__ == "function"]
#listFunc= [name for (name , obj) in vars().items() if hasattr(obj, "__class__") and obj.__class__.__name__ == "function"]
#listFunc = [func for func in dir(function) if callable(getattr(function, func))]