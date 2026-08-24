const VALUES = [
  {
    number: '01',
    title: 'Familia',
    copy: 'Construimos desde la conexión, el respeto y las raíces compartidas.',
  },
  {
    number: '02',
    title: 'Autenticidad',
    copy: 'Sin filtros. Una identidad real que se lleva con orgullo.',
  },
  { number: '03', title: 'Calidad', copy: 'Detalles pensados para acompañarte en cada día.' },
  { number: '04', title: 'Comunidad', copy: 'Una marca crece cuando su gente también crece.' },
]

export function Values() {
  return (
    <section className="values section" aria-labelledby="valores-titulo">
      <h2 className="sr-only" id="valores-titulo">
        Lo que representamos
      </h2>
      <p className="eyebrow dark">Lo que representamos</p>
      <ul className="values-grid">
        {VALUES.map((value) => (
          <li key={value.number}>
            <span>{value.number}</span>
            <h3>{value.title}</h3>
            <p>{value.copy}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
