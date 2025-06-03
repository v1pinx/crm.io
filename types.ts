export interface Rule {
    id: string
    field: string
    operator: string
    value: string
    connector?: "AND" | "OR"
}

export interface Segment {
    name: string
    description: string
    rules: Rule[]
}
