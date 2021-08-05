from modules import *

client = discord.Client()

@client.event
async def on_ready():
    print('We have logged in as {0.user}'.format(client))
    channel = client.get_channel(int(786919558522994716))
    embed = discord.Embed(colour = 0xe6002e, title='System', description = 'Успешеый запуск {0.user}'.format(client))
    #embed.set_author(name="Bot")
    #embed.set_author(name="Bot", url="https://yandex.ru/", icon_url="url image ico")
    #embed.set_thumbnail(url="url image ico")
    #embed.add_field(name=" ", value=" ", inline=True)
    #embed.set_footer(text=" ")
    await channel.send(embed = embed)

@client.event
async def on_message(message):
    if message.author == client.user:
        return

    if message.content.strip()[0] != '!':
        return

    args = message.content.strip().lstrip(config['prefix']).split(" ")
    
    #try:
    if args[0] in functions.methods:
        function = getattr(functions, args[0])
        await function(message, args)
    else:
        return
    #except Exception as err:
    #    print("Error: \n" + str(err))
    #    embed = discord.Embed(colour = 0xe6002e, title=f"ERROR: \n {str(err)}")
    #    await message.channel.send(embed = embed)
    #    return

client.run(config['token']) # Обращаемся к словарю settings с ключом token, для получения токена

#########################################################

#listFunc= [name for (name , obj) in vars().items() if hasattr(obj, "__class__") and obj.__class__.__name__ == "function"]
#listFunc = [func for func in dir(function) if callable(getattr(function, func))]
