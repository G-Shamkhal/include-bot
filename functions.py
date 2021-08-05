from modules import *

async def send(message, author, heading, description, color):
    embed = discord.Embed(colour = color, title=heading, description = description)
    embed.set_author(name=author)
    await message.channel.send(embed = embed)

async def img(message, args):
    ran = random.randint(0, 9)
    resource = googleapiclient.discovery.build("customsearch", "v1", developerKey=config['api_key']).cse()
    result = resource.list(
        q=f"{args[1]}", cx=config['searchID'], searchType="image"
    ).execute()
    url = result["items"][ran]["link"]
    embed = discord.Embed(colour = 0xff9900, title=f"Вот ваше изображение ({args[1].title()})")
    embed.set_image(url=url)
    await message.channel.send(embed = embed)

async def hello(message, args):
    await message.channel.send('Hello!')

async def quote(message, args):
    response = requests.get("https://zenquotes.io/api/random")
    json_data = json.loads(response.text)

    quote = [json_data[0]['a'], json_data[0]['q']]

    translator = Translator()
    translate = translator.translate(quote[1], dest='ru')

    quote[1] = "EN: " + quote[1] + "\n\n" "RU: " + translate.text
    
    await send(message, "Цитата", quote[0], quote[1], 0x00BFFF)

methods = [name for (name , obj) in vars().items() if hasattr(obj, "__class__") and obj.__class__.__name__ == "function"]