import { Serializable } from '../format/serializable'
import { EarlyContext, getContextValue, HsrElement, LateContext, SupportedContextStat, Trait } from './context'

export enum MatcherType {
  // -------------
  // META MATCHERS
  // -------------
  ALL,
  EARLY_ALL,
  ANY,
  EARLY_ANY,
  // -------------
  // STAT MATCHERS
  // -------------
  ELEMENT,
  TRAIT,
  STAT,
  ALWAYS,
}

export abstract class Matcher {
  abstract match(context: Readonly<LateContext>): boolean
}

/**
 * Due to typescript trashy structural type system, in fact, this class does
 * little to enhance type safety.
 */
export abstract class EarlyMatcher extends Matcher {
  abstract match(context: Readonly<EarlyContext>): boolean
  // so that Matcher does not fit the trait EarlyMatcher, which means passing a
  // Matcher into something that accepts an EarlyMatcher will be flagged by
  // Typescript.
  declare __this_argument_accepts_EarlyMatcher_only__You_passed_a_Matcher: number
}

type __EmptyObject = Record<string, never>

export class AlwaysMatcher extends EarlyMatcher implements Serializable<__EmptyObject, AlwaysMatcher> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  match(_context: Readonly<EarlyContext>): boolean {
    return true
  }

  serialize(): __EmptyObject {
    return {}
  }

  __deserialize(this: undefined, _json: __EmptyObject): AlwaysMatcher {
    return alwaysMatch()
  }
}
const always: AlwaysMatcher = new AlwaysMatcher()

export function alwaysMatch() {
  return always
}

/**
 * Matcher that matches when all containing matchers match. If no containing
 * matcher is available, this matcher matches.
 */
export class AllMatcher extends Matcher {
  constructor(
    private matchers: Matcher[],
  ) {
    super()
  }

  match(context: Readonly<LateContext>): boolean {
    for (const matcher of this.matchers) {
      if (!matcher.match(context)) {
        return false
      }
    }
    return true
  }
}

export function matchAll(...matchers: Matcher[]) {
  return new AllMatcher(matchers)
}

export class EarlyAllMatcher extends AllMatcher {
  constructor(
    matchers: EarlyMatcher[],
  ) {
    super(matchers)
  }
}

export function matchAllEarly(...matchers: EarlyMatcher[]) {
  return new EarlyAllMatcher(matchers)
}

/**
 * Matcher that matches if any containing matcher matches. If no containing
 * matcher is available, this matcher doesn't match.
 */
export class AnyMatcher extends Matcher {
  constructor(
    private matchers: Matcher[],
  ) {
    super()
  }

  public match(context: Readonly<LateContext>): boolean {
    for (const matcher of this.matchers) {
      if (matcher.match(context)) {
        return true
      }
    }
    return false
  }
}

export function matchAny(...matchers: Matcher[]) {
  return new AnyMatcher(matchers)
}

export class EarlyAnyMatcher extends AnyMatcher {
  constructor(
    matchers: EarlyMatcher[],
  ) {
    super(matchers)
  }
}

export function matchAnyEarly(...matchers: EarlyMatcher[]) {
  return new EarlyAnyMatcher(matchers)
}

export class ElementMatcher extends EarlyMatcher {
  constructor(private element: HsrElement) {
    super()
  }

  match(context: Readonly<EarlyContext>): boolean {
    return this.element === context.element
  }
}

// Since there are only 7 elements, we can cache them. Should we cache other
// types of matcher?
const elementMatchers: ElementMatcher[] = Object.values(HsrElement)
  .filter((val): val is HsrElement => typeof val !== 'string')
  .map((element) => new ElementMatcher(element))

/**
 * A Matcher that match if the provided element is exactly the same as the
 * context.
 */
export function matchByElement(element: HsrElement): EarlyMatcher {
  return elementMatchers[element]
}

export class TraitMatcher extends EarlyMatcher {
  constructor(private traits: Trait[]) {
    super()
  }

  match(context: Readonly<EarlyContext>): boolean {
    // Most of the time context traits will have 1 trait
    if (context.traits.length === 1) {
      return this.traits.includes(context.traits[0])
    }
    // Additional damage has no trait (or it's healing or chance)
    if (context.traits.length === 0) {
      return false
    }
    // is this even worth a fast path?
    if (this.traits.length === 1) {
      return context.traits.includes(this.traits[0])
    }

    return context.traits.some((trait) => this.traits.includes(trait))
  }
}

/**
 * Matcher that matches if the context traits and provided traits share at least
 * one common element. In other word, if Intersection(Context Traits, Provided
 * Traits) >= 1
 */
export function matchByTraits(...traits: Trait[]): EarlyMatcher {
  return new TraitMatcher(traits)
}

/**
 * A condition can vary. Designing a good frame for them is challenging. For
 * example, it should be able to express both:
 * - ```critRate > 0.7 -> 0.2 dmgBonus```
 * - ```ehr -> ehr * 0.6 dmgBonus```
 *
 * While implementing them as your typical Javascript function is trivial, the
 * unique challenge of passing them through ```structuredClone``` is not.
 *
 * There are 2 ways to implement a safely serializable condition. One such way
 * is by enumerate all possible condition available (the game only has, like, 10
 * such conditions). By directly declaring it in source code, we can just safely
 * serialize and deserialize simply through the index.
 *
 * Another way is limiting it to a set of well defined constraint. For example,
 * ```critRate < 0.5``` is very much expressible. One such way is ```{"stat":
 * "critRate", "type": "<", "value": 0.5}```.
 *
 * There exists a 3rd fast, almost reliable, but is pretty much a code smell.
 * Basically, we serialize with ```function.toString``` and deserialize with
 * ```eval```.
 */
declare type _Unused = never // exist to force JSDoc rendering from IDE.

/*
 * Below is the implementation for the 2nd way.
 */
export enum SupportedMatchType {
  GREATER_THAN,
  GREATER_THAN_OR_EQUAL,
  LESSER_THAN,
  LESSER_THAN_OR_EQUAL,
  EQUAL,
}

export class UnassumingStatMatcher extends Matcher {
  constructor(
    private whichStat: SupportedContextStat,
    private matchType: SupportedMatchType,
    private value: number,
  ) {
    super()
  }

  public match(context: Readonly<LateContext>): boolean {
    const curr = getContextValue(context, this.whichStat)
    switch (this.matchType) {
      case SupportedMatchType.GREATER_THAN_OR_EQUAL:
        return curr >= this.value
      case SupportedMatchType.LESSER_THAN_OR_EQUAL:
        return curr <= this.value
      case SupportedMatchType.GREATER_THAN:
        return curr > this.value
      case SupportedMatchType.LESSER_THAN:
        return curr < this.value
      case SupportedMatchType.EQUAL:
        return curr === this.value
      default:
        throw new Error(
          'Unknown match type: ' + SupportedMatchType[this.matchType],
        )
    }
  }
}

/**
 * {@link $$Unused Link} for a better explaination.
 */
export function matchByStat(
  whichStat: SupportedContextStat,
  type: SupportedMatchType,
  value: number,
) {
  return new UnassumingStatMatcher(whichStat, type, value)
}
