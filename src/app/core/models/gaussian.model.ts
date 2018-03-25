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
