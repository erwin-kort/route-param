export let trailingLeading = (str: string) => {
  let leading = str[0] == '/'
  let trailing = str[str.length - 1] == '/'

  if (leading && trailing) {
    str = str.substring(1, str.length - 1)
  } else if (leading) {
    str = str.substring(1)
  } else if (trailing) {
    str = str.substring(0, str.length - 1)
  }

  return str
}

export type Param = { name: string, optional: boolean, wild: boolean } | null

export let parseParams = (segments: string[]) => {
  let si = 0
  let seg: string
  let params: Param[] = []

  while (si < segments.length) {
    seg = segments[si++]

    let param = null

    if (seg[0] == ':') {
      param = { name: seg.substring(1), optional: false, wild: false }

      let l = seg[seg.length - 1]
      let l2 = seg[seg.length - 2]

      if (l == '?') {
        if (l2 == '*') {
          param.name = seg.substring(1, seg.length - 2)
          param.wild = true
        } else {
          param.name = seg.substring(1, seg.length - 1)
        }

        param.optional = true
      } else if (l == '*') {
        if (l2 == '?') {
          param.name = seg.substring(1, seg.length - 2)
          param.optional = true
        } else {
          param.name = seg.substring(1, seg.length - 1)
        }

        param.wild = true
      }
    }

    params.push(param)
  }

  return params
}
