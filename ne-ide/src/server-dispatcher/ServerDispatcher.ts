import { injectable } from 'inversify';
import { ConnectionStatus, IRpcEvent, IRpcResponseEvent, IServerDispatcher, ResolvePromiseType, ServerDispactherEvents,  } from './IServerDispatcher';
import { EventEmitter } from '../core/utils/events/EventEmitter';
import { IEventEmitter } from '../core/utils/events/IEventEmitter';
import { NotificationEvent } from '../core/utils/events/NotificationEvent';

import 'reflect-metadata'

@injectable()
export class ServerDispatcher implements IServerDispatcher {
    private port = 8000;
    private hostname = 'localhost';
    private connectionStatus = ConnectionStatus.PENDING;

    private socket: WebSocket;
    private eventsQueue: IRpcEvent[] = [];

    private eventEmitter = new EventEmitter<ServerDispactherEvents>();

    constructor() {
        this.socket = new WebSocket(`ws://${this.hostname}:${this.port}`);
        this.socket.addEventListener('open', (event) => {
            this.setConnectionStatus(ConnectionStatus.CONNECTED);
            console.log(`Содеинение с ${this.socket.url} открыто`);

            this.socket.addEventListener('message', (event: MessageEvent<IRpcResponseEvent>) => {
                const response = event.data;
                console.log('Данные с сервера', event.data)
    
                let targetEvent: IRpcEvent | undefined;
                this.eventsQueue.filter((rpcEvent: IRpcEvent) => {
                    if (rpcEvent.timestamp === response.timestamp) {
                        targetEvent = rpcEvent;
    
                        return false;
                    }
    
                    return true;
                })
    
                if (targetEvent) {
                    targetEvent.resolve(response.data);
                }
            });

            this.socket.addEventListener('close', () => {
                this.setConnectionStatus(ConnectionStatus.CONNECTION_LOST);
            })

            this.sendNotification(`"[{\"_id\":\"6642a57d91992e1730e316b4\",\"index\":0,\"guid\":\"fe971041-bc1b-4442-8fd2-584f06783675\",\"isActive\":false,\"balance\":\"$2,023.01\",\"picture\":\"http://placehold.it/32x32\",\"age\":37,\"eyeColor\":\"brown\",\"name\":\"SweeneyBauer\",\"gender\":\"male\",\"company\":\"ISOSURE\",\"email\":\"sweeneybauer@isosure.com\",\"phone\":\"+1(888)515-2381\",\"address\":\"992MillAvenue,Brewster,Georgia,1775\",\"about\":\"InLoremetealaboriseuduisminimcupidatatanimirureirureminimminimex.Quisintproidentaliquipidnostruddotemporincididuntesseutexercitationindolorecommodo.Occaecatcommodononineuest.Sitlaborismagnaidaliquip.AutelaborisreprehenderitLoremelitnulladoculpanonnonaliquipullamco.ConsecteturutfugiatLoremcupidatatduisidconsecteturinfugiatexercitationcupidatatadipisicingconsectetur.\\r\\n\",\"registered\":\"2023-07-06T07:23:35-03:00\",\"latitude\":78.358229,\"longitude\":79.985479,\"tags\":[\"do\",\"ex\",\"anim\",\"eiusmod\",\"in\",\"cillum\",\"nisi\"],\"friends\":[{\"id\":0,\"name\":\"JudyBernard\"},{\"id\":1,\"name\":\"HuffObrien\"},{\"id\":2,\"name\":\"BergHead\"}],\"greeting\":\"Hello,SweeneyBauer!Youhave7unreadmessages.\",\"favoriteFruit\":\"apple\"},{\"_id\":\"6642a57df5ccf9dbc73446ed\",\"index\":1,\"guid\":\"56b0fa88-d436-42fc-97f6-078cf7791467\",\"isActive\":true,\"balance\":\"$2,136.10\",\"picture\":\"http://placehold.it/32x32\",\"age\":29,\"eyeColor\":\"brown\",\"name\":\"TraceySawyer\",\"gender\":\"female\",\"company\":\"AFFLUEX\",\"email\":\"traceysawyer@affluex.com\",\"phone\":\"+1(810)426-2548\",\"address\":\"428SebaAvenue,Greenwich,PuertoRico,9828\",\"about\":\"LaborisnullaculpaexcepteurnonsintminimminimLoremcupidatatmagnainquisfugiat.Laborumenimeaexsintduis.Ullamcoullamcoconsecteturullamcoeiusmodamet.Consecteturcupidatatcillumadipisicingreprehenderitexercitationculpanisisuntconsequat.Cupidatatcommodoculpaproidentexfugiatametexcepteurreprehenderitveniamcillumadestfugiat.\\r\\n\",\"registered\":\"2018-03-29T11:15:21-03:00\",\"latitude\":84.007922,\"longitude\":106.933551,\"tags\":[\"consequat\",\"labore\",\"do\",\"dolore\",\"est\",\"ullamco\",\"anim\"],\"friends\":[{\"id\":0,\"name\":\"MullinsLloyd\"},{\"id\":1,\"name\":\"MaldonadoRich\"},{\"id\":2,\"name\":\"FreidaKline\"}],\"greeting\":\"Hello,TraceySawyer!Youhave2unreadmessages.\",\"favoriteFruit\":\"banana\"},{\"_id\":\"6642a57dd145969718447060\",\"index\":2,\"guid\":\"e3fd779d-1f78-426b-b0bf-c6f46f7f4db1\",\"isActive\":false,\"balance\":\"$1,267.17\",\"picture\":\"http://placehold.it/32x32\",\"age\":25,\"eyeColor\":\"green\",\"name\":\"StephanieJoseph\",\"gender\":\"female\",\"company\":\"NORSUP\",\"email\":\"stephaniejoseph@norsup.com\",\"phone\":\"+1(946)502-2152\",\"address\":\"578JamaicaAvenue,Nord,Arizona,4125\",\"about\":\"Adipisicingiruretempordotempormollitlaborismollitoccaecatdeseruntaliquipofficiaqui.Aliquipanimlaboresintanimmagnadodotemporculpairureexnostrud.Esseetnostrudametquiselit.Deseruntvelitelitaliquipconsequateiusmodreprehenderitlaboreexcepteur.Adullamcoadetlaborenisidolorconsequatnullaconsequat.Exercitationpariaturnostrudmagnaullamconostrudeutemporeamollitametautenonduis.Commodoirureduisexercitationmollitconsecteturdeseruntduislaborenullasintofficiaconsequatlaborevoluptate.\\r\\n\",\"registered\":\"2014-02-20T10:56:41-04:00\",\"latitude\":-16.910444,\"longitude\":165.619364,\"tags\":[\"fugiat\",\"laboris\",\"commodo\",\"enim\",\"quis\",\"ullamco\",\"sit\"],\"friends\":[{\"id\":0,\"name\":\"ManuelaHahn\"},{\"id\":1,\"name\":\"CantrellGill\"},{\"id\":2,\"name\":\"NonaHansen\"}],\"greeting\":\"Hello,StephanieJoseph!Youhave4unreadmessages.\",\"favoriteFruit\":\"apple\"},{\"_id\":\"6642a57d5480afd5b112d25d\",\"index\":3,\"guid\":\"b34b5c05-7f83-492c-8a51-42263d43e853\",\"isActive\":true,\"balance\":\"$2,189.01\",\"picture\":\"http://placehold.it/32x32\",\"age\":25,\"eyeColor\":\"blue\",\"name\":\"KellyYates\",\"gender\":\"male\",\"company\":\"KINETICUT\",\"email\":\"kellyyates@kineticut.com\",\"phone\":\"+1(909)486-2523\",\"address\":\"508MapleStreet,Hampstead,AmericanSamoa,8145\",\"about\":\"Laborecillumnostrudnisiid.Euullamcoconsequatduisaddoloreadauteinconsectetursunt.EuLoremaliquipvelitnostrudutetnonnisinonveniam.Incididuntanimreprehenderitdolorduis.Commodoidvoluptateautenonenimquistemporadofficiaaliquipexercitationpariatur.Nisietcommodoconsecteturexcepteurlaborumipsumconsequatetveniamestdeseruntanimlabore.\\r\\n\",\"registered\":\"2021-08-13T06:10:57-03:00\",\"latitude\":62.292437,\"longitude\":139.778132,\"tags\":[\"adipisicing\",\"quis\",\"aute\",\"velit\",\"cupidatat\",\"quis\",\"dolor\"],\"friends\":[{\"id\":0,\"name\":\"JeriHartman\"},{\"id\":1,\"name\":\"CarrieSummers\"},{\"id\":2,\"name\":\"MarianNorman\"}],\"greeting\":\"Hello,KellyYates!Youhave8unreadmessages.\",\"favoriteFruit\":\"banana\"},{\"_id\":\"6642a57da402e0c4f849b79b\",\"index\":4,\"guid\":\"8765684e-a728-4a09-9e48-5dd4fd14a6e7\",\"isActive\":false,\"balance\":\"$2,998.75\",\"picture\":\"http://placehold.it/32x32\",\"age\":22,\"eyeColor\":\"blue\",\"name\":\"DianaButler\",\"gender\":\"female\",\"company\":\"LIMOZEN\",\"email\":\"dianabutler@limozen.com\",\"phone\":\"+1(875)535-2372\",\"address\":\"208VerandaPlace,Moscow,SouthCarolina,5296\",\"about\":\"Culpaauteanimcommodoenimmagna.Nullaauteincididuntlaborisexeu.NostrudLoremfugiatreprehenderitconsecteturmagnaadreprehenderitvelitauteeu.Quisenimirureconsectetursitminimeliteuquisconsecteturveliteiusmodest.CulpaquisunteuenimirureLoremnonamet.Animsitametveniamexametauteestsintetconsecteturculpadopariatur.\\r\\n\",\"registered\":\"2016-02-25T12:35:34-03:00\",\"latitude\":-57.027824,\"longitude\":-83.511357,\"tags\":[\"enim\",\"est\",\"nisi\",\"deserunt\",\"cupidatat\",\"mollit\",\"proident\"],\"friends\":[{\"id\":0,\"name\":\"BerylWells\"},{\"id\":1,\"name\":\"WhitleyWatson\"},{\"id\":2,\"name\":\"BrooksRivera\"}],\"greeting\":\"Hello,DianaButler!Youhave2unreadmessages.\",\"favoriteFruit\":\"banana\"},{\"_id\":\"6642a57da43ca2b386fbdc7c\",\"index\":5,\"guid\":\"b32c272c-4b37-4ec2-b24f-52add5074b21\",\"isActive\":false,\"balance\":\"$1,942.71\",\"picture\":\"http://placehold.it/32x32\",\"age\":36,\"eyeColor\":\"blue\",\"name\":\"WootenStevens\",\"gender\":\"male\",\"company\":\"PROWASTE\",\"email\":\"wootenstevens@prowaste.com\",\"phone\":\"+1(851)487-3834\",\"address\":\"942NewtonStreet,Cotopaxi,Delaware,6082\",\"about\":\"Minimlaborealiqualaborissitiruredolore.Nullaanimconsequatexadipisicinglaborumcillum.Aliquipsitpariatureaculpa.\\r\\n\",\"registered\":\"2018-12-19T05:11:32-03:00\",\"latitude\":45.274499,\"longitude\":-55.566364,\"tags\":[\"nostrud\",\"incididunt\",\"labore\",\"ut\",\"dolore\",\"do\",\"sint\"],\"friends\":[{\"id\":0,\"name\":\"HesterBerg\"},{\"id\":1,\"name\":\"KristineGriffith\"},{\"id\":2,\"name\":\"RiddleChambers\"}],\"greeting\":\"Hello,WootenStevens!Youhave8unreadmessages.\",\"favoriteFruit\":\"banana\"}]"`);
        });

        setTimeout(() => {
            if (this.connectionStatus === ConnectionStatus.PENDING) {
                this.setConnectionStatus(ConnectionStatus.CONNECTION_LOST);
            }
        }, 1000);
    }

    public getEventEmitter(): IEventEmitter<ServerDispactherEvents> {
        return this.eventEmitter;
    }

    public sendNotification(method: string): void {
        this.send(method);
    }

    public sendNotificationWithParams(method: string, params: any[]): void {
        this.send(method, params);
    }

    public sendRequest<T>(method: string): Promise<T> {
        return new Promise((resolve) => {
            this.registerRequestEvent(method, resolve);
            this.send(method);
        });
    }

    public sendRequestWithParams<T>(method: string, params?: any[]): Promise<T> {
        return new Promise((resolve) => {
            this.registerRequestEvent(method, resolve);
            this.send(method, params);
        });
    }

    public getConnectionStatus(): ConnectionStatus {
        return this.connectionStatus;
    }
    
    private send(method: string, params?: any[]) {
        this.socket.send(JSON.stringify({
            method: method,
            ...(params && { params: params } ) 
        }));
    }

    private registerRequestEvent(method: string, resolve: ResolvePromiseType) {
        this.eventsQueue.push({
            timestamp: new Date().valueOf(),
            method: method,
            resolve: resolve
        });
    }

    private setConnectionStatus(status: ConnectionStatus) {
        this.connectionStatus = status;

        this.eventEmitter.fireEvent(
            new NotificationEvent<ServerDispactherEvents>(ServerDispactherEvents.CONNECTION_STATUS_UPDATED)
        );
    }
}