const PUNTOS = [
  { numero: '01', texto: 'Diseño con identidad' },
  { numero: '02', texto: 'Hecho para destacar' },
  { numero: '03', texto: 'Construido en familia' },
]

export function Promise() {
  return (
    <section className="promise" aria-labelledby="promesa-titulo">
      <p className="eyebrow" id="promesa-titulo">
        La promesa 31st
      </p>
      <ul>
        {PUNTOS.map((punto) => (
          <li key={punto.numero}>
            <span>{punto.numero}</span>
            <p>{punto.texto}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
