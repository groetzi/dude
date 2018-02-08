import { Component, OnInit } from '@angular/core';
import { UniverseService } from '../../../core/services/universe.service';

@Component({
    selector: 'app-action-menu',
    templateUrl: './action-menu.component.html',
    styleUrls: ['./action-menu.component.css']
})
export class ActionMenuComponent implements OnInit {
    constructor(private universe: UniverseService) { }

    ngOnInit() { }

    spawnCreature() {
        this.universe.spawnCreature();
    }

    getStats() {
        return [{
            name: 'Creatures',
            value: this.universe.getState().creatures
        }, {
            name: 'Reproduction rate',
            value: this.universe.getState().reproductionRate
        }, {
            name: 'Current year',
            value: this.universe.getState().currentYear
        }];
    }
}
