import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/bufferCount';

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
    reproductionRate: number;
    creatures: number;
    lifeExpectancy: number;
    ticksPerYear: number;
    currentYear: number;
}

@Injectable()
export class UniverseService {
    private ticker = Observable.timer(0, 1000);
    constructor() {
        this.ticker.subscribe(() => {
            this.spawnCreature(Math.round(this.state.creatures / 2 * this.state.reproductionRate));
        });
        this.ticker.bufferCount(this.state.ticksPerYear).subscribe(() => this.incYear());
    }

    private state: IState = {
        creatures: 1000,
        reproductionRate: 0.01,
        lifeExpectancy: 1,
        ticksPerYear: 100,
        currentYear: 0,
    };

    spawnCreature(amount = 1) {
        const newState = {
            ...this.state,
            creatures: this.state.creatures + amount
        };
        this.state = newState;
    }

    incYear() {
        this.state = {
            ...this.state,
            currentYear: this.state.currentYear + 1
        };
    }

    getState() {
        return this.state;
    }
}
