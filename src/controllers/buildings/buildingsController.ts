import { IControllerCommunicatorDelegate } from '../communicationDelegates/communicationDelegates';

// TODO Singleton. We could make an InjectorService that takes care of dependency injection..?

/**
 * Express Routable controller - knows how to handle request and response from express.js
 * // TODO See if ExpressController needs to be factored out into a common class. Maybe BuildingsController can
 *              hold an express delegate that knows how to handle req and res.
 */
export class BuildingsController {
    constructor () {

    }

    public buildingList (communicationDelegate: IControllerCommunicatorDelegate) {
        const city: string = communicationDelegate.getQuery('City');
        const addressLike: string = communicationDelegate.getQuery('Address');
        // ... actual functionality here. Figure out how to adapt Mongoose into RxJS and TS - This is the real fun part!!! WOoooo 
        communicationDelegate.sendResponse({bleep: 'bloop'});
    }
}