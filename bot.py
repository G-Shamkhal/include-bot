from modules import *

client = discord.Client()

@client.event
async def on_ready():
    print(f'We have logged in as {client.user.name}')
    channel = client.get_channel(int(786919558522994716))
    embed = discord.Embed(colour = 0xe6002e, title='sys.INFO', description = f'{client.user.name} запустился!')
    #embed.set_author(name="System")
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
        await function(client, message, args)
    else:
        return
    #except Exception as err:
    #    print("Error: \n" + str(err))
    #    embed = discord.Embed(colour = 0xe6002e, title=f"sys.ERROR\n {str(err)}")
    #    await message.channel.send(embed = embed)
    #    return

client.run(config['token']) # Обращаемся к словарю settings с ключом token, для получения токена