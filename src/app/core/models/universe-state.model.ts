export interface IUniverseState {
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
