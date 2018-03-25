import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/bufferCount';
import gaussian = require('gaussian');
import { MessagesService } from './messages.service';
import { IUniverseState } from '../models/universe-state.model';

/**
 * Milliseconds between universe ticks.
 * Each tick triggers a universe evolution by applying e.g. creature reproduction or mortality distributions.
 */
const TICKER = 100;
/** Number of creatures at the beginning. */
const INITIAL_CREATURE_COUNT = 100;
/** Average life expectancy for new creatures. */
const AVERAGE_LIFE_EXPECTANCY = 20;

const DEFAULT_STATE: IUniverseState = {
    creatures: INITIAL_CREATURE_COUNT,
    defaultMortalityDistribution: gaussian(AVERAGE_LIFE_EXPECTANCY, 6) as IGaussian,
    childMortalityDistribution: gaussian(0, 50) as IGaussian,
    pregnancyDistribution: gaussian(AVERAGE_LIFE_EXPECTANCY / 2, 5) as IGaussian,
    ticksPerYear: 10,
    currentYear: 0,
    ageDistribution: [INITIAL_CREATURE_COUNT]
};

@Injectable()
export class UniverseService {
    private ticker = Observable.timer(0, TICKER);
    constructor(private messages: MessagesService) {
        this.ticker.subscribe(() => {
            this.reproduceCreatures();
            this.killCreatures();
        });
        this.ticker.bufferCount(this.state.ticksPerYear).subscribe(() => this.incYear());
    }

    private state = DEFAULT_STATE;

    spawnCreatures(amount = 1) {
        this.state.ageDistribution[0] += amount;
        const newState = {
            ...this.state,
            creatures: this.state.creatures + amount
        };
        this.state = newState;
    }

    reproduceCreatures() {
        this.spawnCreatures(
            this.state.ageDistribution
                .map((val, ind) => {
                    // num pregnancies in age group
                    const pregs = Math.round(val / 2 * this.state.pregnancyDistribution.pdf(ind));
                    if (pregs > 0) {
                        this.messages.info(`age group ${ind} reproduced ${pregs}`);
                    }
                    return pregs;
                })
                .reduce((prev, curr) => prev + curr, 0)
        );
    }

    killCreatures() {
        const died = {
            old: 0,
            children: 0
        };

        let ageDistribution = this.state.ageDistribution.map((num, index) => {
            // apply default mortality
            const dead = Math.round(num * this.state.defaultMortalityDistribution.cdf(index));
            let newNum = num - dead;
            died.old += dead;

            // apply child mortality
            const deadChildren = Math.round(num * this.state.childMortalityDistribution.pdf(index));
            newNum -= deadChildren;
            died.children += deadChildren;

            return newNum;
        });

        this.messages.info(`child mortality killed ${died.children}`);
        this.messages.info(`age mortality killed ${died.old}`);

        // strip of rest of the array that contains only 0
        const last = ageDistribution.reverse().findIndex(e => e > 0);
        ageDistribution = ageDistribution.reverse().slice(0, ageDistribution.length - last);
        this.setAgeDistribution(ageDistribution);
    }

    incYear() {
        this.state = {
            ...this.state,
            currentYear: this.state.currentYear + 1,
            ageDistribution: [0, ...this.state.ageDistribution]
        };
    }

    getState() {
        return this.state;
    }

    /** Updates age distribution and creature count. */
    private setAgeDistribution(ageDistribution: number[]) {
        this.state = {
            ...this.state,
            ageDistribution,
            creatures: ageDistribution.reduce((prev, curr) => prev + curr, 0)
        };
    }
}
