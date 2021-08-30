from modules import *

bot = commands.Bot(command_prefix='!', help_command=None)
bot.add_cog(functions.Bot(bot))

@bot.event
async def on_ready():
    print('Logged in as:\n{0.user.name}\n{0.user.id}'.format(bot))
    channel = bot.get_channel(int(786919558522994716))
    embed = discord.Embed(colour=0xe6002e, title='sys.INFO', description=f'```yml\n{bot.user.name} запустился!\n```')
    await channel.send(embed=embed)

@bot.event
async def on_command_error(ctx, error):
    if isinstance(error, CommandNotFound):
        #print(bot.user.avatar_url())
        await ctx.send(embed = discord.Embed(colour=0xe6002e, title='sys.INFO', description = f'** {ctx.author.name}, данной команды не существует.\n'
                                                                                              f'Для получения справки по командам введите: ```diff\n!help```**'))
    #raise error

#bot.run(config['token'])
bot.run(os.environ['token'])