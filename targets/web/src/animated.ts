import React, {
  CSSProperties,
  ComponentPropsWithRef,
  ForwardRefExoticComponent,
} from 'react'
import {
  createAnimatedComponent,
  withExtend,
  WithExtend,
} from '@react-spring/animated'
import { SpringValue } from 'shared'

type JSXElements = keyof JSX.IntrinsicElements

const elements: JSXElements[] = [
  'a',
  'abbr',
  'address',
  'area',
  'article',
  'aside',
  'audio',
  'b',
  'base',
  'bdi',
  'bdo',
  'big',
  'blockquote',
  'body',
  'br',
  'button',
  'canvas',
  'caption',
  'cite',
  'code',
  'col',
  'colgroup',
  'data',
  'datalist',
  'dd',
  'del',
  'details',
  'dfn',
  'dialog',
  'div',
  'dl',
  'dt',
  'em',
  'embed',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hgroup',
  'hr',
  'html',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'keygen',
  'label',
  'legend',
  'li',
  'link',
  'main',
  'map',
  'mark',
  'menu',
  'menuitem',
  'meta',
  'meter',
  'nav',
  'noscript',
  'object',
  'ol',
  'optgroup',
  'option',
  'output',
  'p',
  'param',
  'picture',
  'pre',
  'progress',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'script',
  'section',
  'select',
  'small',
  'source',
  'span',
  'strong',
  'style',
  'sub',
  'summary',
  'sup',
  'table',
  'tbody',
  'td',
  'textarea',
  'tfoot',
  'th',
  'thead',
  'time',
  'title',
  'tr',
  'track',
  'u',
  'ul',
  'var',
  'video',
  'wbr',
  // SVG
  'circle',
  'clipPath',
  'defs',
  'ellipse',
  'foreignObject',
  'g',
  'image',
  'line',
  'linearGradient',
  'mask',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'stop',
  'svg',
  'text',
  'tspan',
]

type CreateAnimated = <T extends React.ElementType>(
  wrappedComponent: T
) => AnimatedComponent<T>

// Extend `animated` with every available DOM element
export const animated: WithExtend<
  CreateAnimated & { [Tag in JSXElements]: AnimatedComponent<Tag> }
> = withExtend(createAnimatedComponent as any).extend(elements)

export { animated as a }

/** The type of an `animated()` component */
export type AnimatedComponent<
  T extends React.ElementType
> = ForwardRefExoticComponent<
  AnimatedProps<ComponentPropsWithRef<T>> & {
    scrollTop?: SpringValue<number> | number
    scrollLeft?: SpringValue<number> | number
  }
>

/** The props of an `animated()` component */
export type AnimatedProps<Props extends object> = {
  [P in keyof Props]: (P extends 'ref' ? Props[P] : AnimatedProp<Props[P]>)
}

type CSSPropertyNames = keyof CSSProperties
type CSSValidProperties<T extends object> = {
  [P in keyof T & CSSPropertyNames]: T[P] extends CSSProperties[P] ? P : never
}[keyof T & CSSPropertyNames]

// The animated prop value of a React element
type AnimatedProp<T> = [T, T] extends [infer T, infer DT]
  ? [DT] extends [never]
    ? never
    : DT extends void
    ? undefined
    : DT extends object
    ? [CSSValidProperties<DT>] extends [never]
      ? DT extends ReadonlyArray<any>
        ? AnimatedStyles<DT>
        : DT
      : AnimatedStyle<T>
    : DT | AnimatedLeaf<T>
  : never

// An animated array of style objects
type AnimatedStyles<T extends ReadonlyArray<any>> = {
  [P in keyof T]: [T[P]] extends [infer DT]
    ? DT extends object
      ? [CSSValidProperties<DT>] extends [never]
        ? DT extends ReadonlyArray<any>
          ? AnimatedStyles<DT>
          : DT
        : { [P in keyof DT]: AnimatedProp<DT[P]> }
      : DT
    : never
}

// An animated object of style attributes
type AnimatedStyle<T> = [T, T] extends [infer T, infer DT]
  ? DT extends void
    ? undefined
    : [DT] extends [never]
    ? never
    : DT extends object
    ? { [P in keyof DT]: AnimatedStyle<DT[P]> }
    : DT | AnimatedLeaf<T>
  : never

// An animated value that is not an object
type AnimatedLeaf<T> = [T] extends [object]
  ? never
  : SpringValue<Exclude<T, object | void>>