import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';

enum CreatureType {
    Human,
    Animal
}

// class Creature {
//     private static counter = 0;

//     readonly type: CreatureType;
//     readonly id: number;

//     constructor(type: CreatureType) {
//         this.id = Creature.counter++;
//         this.type = type;
//     }
// }

interface IState {
    // creatures: Array<Creature>;
    reproductionRate: number;
    creatures: number;
}

@Injectable()
export class UniverseService {
    private ticker = Observable.timer(10 * 1000, 500);
    constructor() {
        this.ticker.subscribe(() => {
            this.spawnCreature(Math.round(this.state.creatures / 2 * this.state.reproductionRate));
        });
    }

    private state: IState = {
        creatures: 0,
        reproductionRate: 0.01
    };

    spawnCreature(amount = 1) {
        const newState = {
            ...this.state,
            creatures: this.state.creatures + amount
        };
        this.state = newState;
    }

    getState() {
        return this.state;
    }
}
