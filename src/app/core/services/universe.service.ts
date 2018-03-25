import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/bufferCount';
import gaussian = require('gaussian');
import { MessagesService } from './messages.service';

const TICKER = 100;
const INITIAL_CREATURE_COUNT = 100;
const TICKS_PER_YEAR = 10;
const AVERAGE_LIFE_EXPECTANCY = 20;
const DEFAULT_MORTALITY_DISTRIBUTION = gaussian(AVERAGE_LIFE_EXPECTANCY, 6) as IGaussian;
const PREGNANCY_DISTRIBUTION = gaussian(AVERAGE_LIFE_EXPECTANCY / 2, 5) as IGaussian;
const CHILD_MORTALITY_DISTRIBUTION = gaussian(0, 50) as IGaussian;

// [0, 1, 10, 20].forEach(val => console.log(val + ': ' + CHILD_MORTALITY_DISTRIBUTION.pdf(val)));

/** API of https://github.com/errcw/gaussian */
interface IGaussian {
    /** the mean (μ) of the distribution */
    mean: number;
    /**the variance (σ^2) of the distribution */
    variance: number;
    /** the standard deviation */
    standardDeviation: number;
    /** the probability density function, which describes the probability of a random variable taking on the value x */
    pdf(x): number;
    /** the cumulative distribution function, which describes the probability of a random variable falling in the interval (−∞, x] */
    cdf(x): number;
    /** the percent point function, the inverse of cdf */
    ppf(x): number;

    //     mul(d): returns the product distribution of this and the given distribution; equivalent to scale(d) when d is a constant
    // div(d): returns the quotient distribution of this and the given distribution; equivalent to scale(1/d) when d is a constant
    /** returns the result of adding this and the given distribution's means and variances */
    add(d): IGaussian;
    // sub(d): returns the result of subtracting this and the given distribution's means and variances
    /** returns the result of scaling this distribution by the given constant */
    scale(c): IGaussian;
}

enum CreatureType {
    Human,
    Animal
}

interface IState {
    reproductionRate: number;
    creatures: number;
    /** kill creatures according to Gaussian around average life expectancy */
    defaultMortalityDistribution: IGaussian;
    /** child mortality distribution */
    childMortalityDistribution: IGaussian;
    pregnancyDistribution: IGaussian;
    ticksPerYear: number;
    currentYear: number;
    /** Each entry in the list represents the number of creatures that have the age defined by the list index. */
    ageDistribution: number[];
}

@Injectable()
export class UniverseService {
    private ticker = Observable.timer(0, TICKER);
    constructor(private messages: MessagesService) {
        this.ticker.subscribe(() => {
            // this.spawnCreatures(Math.round(this.state.creatures / 2 * this.state.reproductionRate));
            this.reproduceCreatures();
            this.killCreatures();
        });
        this.ticker.bufferCount(this.state.ticksPerYear).subscribe(() => this.incYear());
    }

    private state: IState = {
        creatures: INITIAL_CREATURE_COUNT,
        reproductionRate: 0.5,
        defaultMortalityDistribution: DEFAULT_MORTALITY_DISTRIBUTION,
        childMortalityDistribution: CHILD_MORTALITY_DISTRIBUTION,
        pregnancyDistribution: PREGNANCY_DISTRIBUTION,
        ticksPerYear: TICKS_PER_YEAR,
        currentYear: 0,
        ageDistribution: [INITIAL_CREATURE_COUNT]
    };

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
                    const pregs = Math.round(val / 2 * PREGNANCY_DISTRIBUTION.pdf(ind));
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
