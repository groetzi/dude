import { Component, OnInit } from '@angular/core';
import { UniverseService } from '../../../core/services/universe.service';

@Component({
    selector: 'app-action-menu',
    templateUrl: './action-menu.component.html',
    styleUrls: ['./action-menu.component.css']
})
export class ActionMenuComponent implements OnInit {
    constructor(private universe: UniverseService) {}

    ngOnInit() {}

    spawnCreature() {
        this.universe.spawnCreature();
    }

    getNumCreatures() {
        return this.universe.getState().creatures;
    }
    getReproRate() {
        return this.universe.getState().reproductionRate;
    }
}
