import { inject, injectable, multiInject } from 'inversify';
import { ICommand, ICommandDescriptor } from './commands';
import { ICommandDto } from './ICommandDto';
import { CommandContext } from './CommandsContexts';
import { ICommandsProvider } from './ICommandsProvider';
import { IIconsProvider } from '../IIconsProvider';
import { IconsProvider } from '../IconsProvider';
import { CORE_TYPES } from '../../module-types';
import { ICommandRegister } from './ICommandRegister';

import 'reflect-metadata';
import { ICommandContribution } from './ICommandContribution';

@injectable()
export class CommandsProviderMockImpl implements ICommandsProvider, ICommandRegister {
    private iconsProvider: IIconsProvider;
    private commandsMapper = new Map<string, ICommandDescriptor>();
    private contextMapper = new Map<CommandContext, ICommandDescriptor[]>();

    constructor(
        @inject(CORE_TYPES.IIconsProvider) iconsProvier: IconsProvider,
        @multiInject(CORE_TYPES.ICommandContribution) commandsContributions: ICommandContribution[]
    ) {
        this.iconsProvider = iconsProvier;
        
        commandsContributions.forEach((command: ICommandContribution) => {
            command.registerCommands(this);
        });
    }

    public async executeCommand(commandId: string, ...args:[]): Promise<unknown>{
        const command = this.commandsMapper.get(commandId);

        // TODO: Заменить промис на вызов сервера
        return new Promise((resolve) => {
            if (command && command.execute) {
                resolve(command.execute.apply(null, args));
            }

            this.reject();
        });
    }

    public getCommandsByContext(context: string): ICommand[] {  
        return Array.from(this.commandsMapper.values())
            .filter((command: ICommandDescriptor) => command.context === context )
            .map<ICommand>((command: ICommandDescriptor) => {
                return {
                    ...command,
                    iconComponent: this.iconsProvider.getIconById(command.iconId)
                }
            });
    }

    public registerCommand(command: ICommandDescriptor) {
        if (this.commandsMapper.has(command.id)) {
            // TODO: Вывести сообщение в окно диалога

            return;
        }

        // Command mapping
        this.commandsMapper.set(command.id, command);
    
        // Context mapping    
        if (command.context !in CommandContext) {
            // TODO: вывести сообщение в окно диалога

            return;
        }

        const context = command.context as CommandContext
        if (!this.contextMapper.has(context)) {
            this.contextMapper.set(context, []);
        }

        this.contextMapper.get(context)?.push(command);
    }

    private reject() {
        // TODO: command not found message
    }
}