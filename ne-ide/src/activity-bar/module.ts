import { Container } from "inversify";
import { IDIModule } from "../core/dependencies/IDIModule";
import { ActivityBarContribution } from "./ActivityBarContribution";
import { CORE_TYPES } from "../core/module-types";

export class ActivityBarModule implements IDIModule {
    public registerModule(container: Container) {
        container
            .bind(CORE_TYPES.ICommandContribution)
            .to(ActivityBarContribution);
    }
}