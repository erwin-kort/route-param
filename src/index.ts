import { trailingLeading, parseParams, Param } from './util'

export type RouteParams<R extends string> =
  R extends `${infer Prev}/${infer Rest}`
    ? RouteParams<Prev> & RouteParams<Rest>
  : R extends `${string}:${infer P}*?/${infer Rest}`
    ? { [K in P]: string[] } & RouteParams<Rest>
  : R extends `${string}:${infer P}?*/${infer Rest}`
    ? { [K in P]: string[] } & RouteParams<Rest>
  : R extends `${string}:${infer P}?/${infer Rest}`
    ? { [K in P]?: string } & RouteParams<Rest>
  : R extends `${string}:${infer P}*/${infer Rest}`
    ? { [K in P]: string } & RouteParams<Rest>
  : R extends `${string}:${infer P}/${infer Rest}`
    ? { [K in P]: string } & RouteParams<Rest>
  : R extends `${string}:${infer P}*?`
    ? { [K in P]: string[] }
  : R extends `${string}:${infer P}?*`
    ? { [K in P]: string[] }
  : R extends `${string}:${infer P}?`
    ? { [K in P]?: string }
  : R extends `${string}:${infer P}*`
    ? { [K in P]: string[] }
  : R extends `${string}:${infer P}`
    ? { [K in P]: string }
  : {}

export let parse = <R extends string>(route: R) => {
  route = trailingLeading(route) as R

  let routeSegs = route.split('/')
  let params = parseParams(routeSegs)

  return (input: string): RouteParams<R> | null => {
    input = trailingLeading(input)

    let inputSegs = input.split('/')

    let pi = 0
    let si = 0
    let param: Param
    let seg: string
    let wildValue: string[] = []
    let values: any = {}

    while (pi < params.length) {
      param = params[pi]
      seg = inputSegs[si]

      // no param
      if (param === null) {
        if (seg != routeSegs[pi]) {
          return null
        }

        pi++
        si++

        continue
      }

      // normal param
      if (!param.wild) {
        pi++
        si++

        if (seg) {
          values[param.name] = seg
        } else {
          if (!param.optional) {
            return null
          } else {
            values[param.name] = null
          }
        }

        continue
      }

      // wild param
      if (param.wild) {
        if (seg) {
          if (seg == routeSegs[pi + 1]) {
            for (let si2 = si; si2 < inputSegs.length; si2++) {
              if (inputSegs[si2] == routeSegs[pi + 1]) {
                wildValue.push(inputSegs[si2])
                si = si2
              }
            }

            wildValue.pop()

            if (!param.optional && !wildValue.length) {
              return null
            }

            values[param.name] = wildValue
            wildValue = []
            pi += 2
            si++

            continue
          }
        } else {
          if (!param.optional && !wildValue.length) {
            return null
          } else {
            values[param.name] = wildValue
            wildValue = []
            pi++
            si++

            continue
          }
        }

        wildValue.push(seg)

        let segsLeft = inputSegs.length - 1 - si
        let paramsLeft = params.length - 1 - pi
        let optionalEnd = (
          pi + 1 != params.length - 1 &&
          params[params.length - 1]?.optional
        ) && 1 || 0

        if (segsLeft == paramsLeft - optionalEnd) {
          values[param.name] = wildValue
          wildValue = []
          pi++
        }

        si++

        continue
      }
    }

    if (si < inputSegs.length) {
      return null
    }

    return values
  }
}
