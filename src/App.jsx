import './App.css'
import { useState } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  const [pantalla, setPantalla] = useState('inicio')
  const [oportunidades, setOportunidades] = useState([])

  const [perfil, setPerfil] = useState({
    busco: '',
    nombre: '',
    carrera: '',
    periodo: '',
    promedio: '',
    ingles: '',
    intereses: '',
    paisInteres: '',
    modalidad: '',
    objetivo: '',
    habilidades: '',
    powerSkills: ''
  })

  function actualizarPerfil(e) {
    const { name, value } = e.target
    setPerfil({
      ...perfil,
      [name]: value
    })
  }

  async function obtenerOportunidades() {
    let query = supabase
      .from('oportunidades')
      .select('*')

    if (perfil.busco) {
      query = query.eq('tipo', perfil.busco)
    }

    if (perfil.modalidad) {
      query = query.eq('modalidad', perfil.modalidad)
    }

    if (perfil.paisInteres) {
      query = query.ilike('pais', `%${perfil.paisInteres}%`)
    }

    const { data, error } = await query

    if (error) {
      console.log(error)
      return
    }

    const textoPerfil = `
      ${perfil.carrera}
      ${perfil.intereses}
      ${perfil.objetivo}
      ${perfil.habilidades}
      ${perfil.powerSkills}
      ${perfil.ingles}
    `.toLowerCase()

    const resultadosOrdenados = data
      .map((item) => {
        const textoOportunidad = `
          ${item.titulo}
          ${item.descripcion}
          ${item.tags}
          ${item.nivel_ingles}
        `.toLowerCase()

        let puntos = 0

        textoPerfil.split(/[\s,]+/).forEach((palabra) => {
          if (palabra.length > 3 && textoOportunidad.includes(palabra)) {
            puntos += 10
          }
        })

        return {
          ...item,
          compatibilidad: Math.min(100, 60 + puntos)
        }
      })
      .sort((a, b) => b.compatibilidad - a.compatibilidad)

    setOportunidades(resultadosOrdenados)
    setPantalla('resultados')
  }

  function generarPerfil(e) {
    e.preventDefault()
    obtenerOportunidades()
  }

  if (pantalla === 'inicio') {
    return (
      <div className="pantalla">
        <section className="hero">
          <h1 className="titulo">Becanda</h1>
          <p className="subtitulo">
            Convertimos perfiles en oportunidades.
          </p>

          <button className="boton" onClick={() => setPantalla('registro1')}>
            Crear mi perfil
          </button>

          <button className="boton-secundario" onClick={() => setPantalla('academy')}>
            Academy
          </button>
        </section>
      </div>
    )
  }

  if (pantalla === 'academy') {
    return (
      <div className="pantalla">
        <section className="tarjeta">
          <h1 className="titulo-form">Becanda Academy</h1>
          <p className="subtitulo-form">
            Recursos para prepararte mejor y aprovechar más oportunidades.
          </p>

          <div className="recurso">
            <h3>Crea tu CV con apoyo de IA</h3>
            <p>Construye un currículum claro, profesional y enfocado en oportunidades académicas.</p>
            <a href="/academy/becanda-cv-builder.html" target="_blank">
              Abrir herramienta
            </a>
          </div>

          <div className="recurso">
            <h3>Practica una entrevista virtual con IA</h3>
            <p>Simula una entrevista para becas, prácticas, concursos o programas académicos.</p>
            <a href="/academy/becanda-simulador-entrevistas.html" target="_blank">
              Abrir simulador
            </a>
          </div>

          <div className="recursos">
            <div className="recurso">
              <h3>Cómo hacer tu CV</h3>
              <p>Aprende a construir un currículum claro, profesional y enfocado en oportunidades académicas.</p>
            </div>

            <div className="recurso">
              <h3>Cómo llenar una convocatoria</h3>
              <p>Guía para entender requisitos, documentos, fechas límite y criterios de evaluación.</p>
            </div>

            <div className="recurso">
              <h3>Cómo aplicar correctamente</h3>
              <p>Consejos para preparar tu postulación y evitar errores comunes.</p>
            </div>

            <div className="recurso">
              <h3>Cómo prepararte para una entrevista</h3>
              <p>Recomendaciones para comunicar tu perfil, experiencia y motivación con seguridad.</p>
            </div>
          </div>

          <button className="boton-secundario" onClick={() => setPantalla('inicio')}>
            Regresar
          </button>
        </section>
      </div>
    )
  }

  if (pantalla === 'registro1') {
    return (
      <div className="pantalla">
        <section className="tarjeta">
          <h1 className="titulo-form">Datos básicos</h1>
          <p className="subtitulo-form">Primero cuéntanos qué estás buscando y quién eres</p>

          <form className="formulario">
            <select name="busco" onChange={actualizarPerfil}>
              <option value="">Busco</option>
              <option value="beca">Beca</option>
              <option value="practicas">Prácticas</option>
              <option value="certificacion">Certificación</option>
              <option value="concurso">Concurso</option>
              <option value="intercambio">Intercambio</option>
              <option value="investigacion">Investigación</option>
              <option value="microcredencial">Microcredencial</option>
              <option value="hackathon">Hackathon</option>
            </select>

            <input name="nombre" placeholder="Nombre completo" onChange={actualizarPerfil} />
            <input name="carrera" placeholder="Carrera" onChange={actualizarPerfil} />
            <input name="periodo" placeholder="Periodo" onChange={actualizarPerfil} />
            <input name="promedio" placeholder="Promedio" onChange={actualizarPerfil} />

            <select name="ingles" onChange={actualizarPerfil}>
              <option value="">Nivel de inglés</option>
              <option value="A1 - Básico inicial">A1 - Básico inicial</option>
              <option value="A2 - Básico">A2 - Básico</option>
              <option value="B1 - Intermedio">B1 - Intermedio</option>
              <option value="B2 - Intermedio avanzado">B2 - Intermedio avanzado</option>
              <option value="C1 - Avanzado">C1 - Avanzado</option>
              <option value="C2 - Dominio profesional">C2 - Dominio profesional</option>
            </select>

            <textarea
              name="intereses"
              placeholder="Intereses: IA, diseño, negocios, investigación..."
              onChange={actualizarPerfil}
            />

            <button type="button" className="boton" onClick={() => setPantalla('registro2')}>
              Continuar
            </button>
          </form>
        </section>
      </div>
    )
  }

  if (pantalla === 'registro2') {
    return (
      <div className="pantalla">
        <section className="tarjeta">
          <h1 className="titulo-form">Perfil de oportunidad</h1>
          <p className="subtitulo-form">Ayúdanos a encontrar opciones más compatibles contigo</p>

          <form className="formulario" onSubmit={generarPerfil}>
            <input name="paisInteres" placeholder="País o región de interés" onChange={actualizarPerfil} />

            <select name="modalidad" onChange={actualizarPerfil}>
              <option value="">Modalidad preferida</option>
              <option value="presencial">Presencial</option>
              <option value="virtual">Virtual</option>
              <option value="hibrida">Híbrida</option>
            </select>

            <textarea
              name="objetivo"
              placeholder="¿Cuál es tu objetivo? Ejemplo: fortalecer mi CV, viajar, aprender IA, hacer networking..."
              onChange={actualizarPerfil}
            />

            <textarea
              name="habilidades"
              placeholder="Habilidades técnicas: SolidWorks, programación, Excel, investigación, diseño, análisis de datos..."
              onChange={actualizarPerfil}
            />

            <textarea
              name="powerSkills"
              placeholder="Power Skills: liderazgo, comunicación, trabajo en equipo, creatividad, pensamiento crítico..."
              onChange={actualizarPerfil}
            />

            <button type="button" className="boton-secundario" onClick={() => setPantalla('registro1')}>
              Regresar
            </button>

            <button className="boton" type="submit">
              Generar perfil
            </button>
          </form>
        </section>
      </div>
    )
  }

  if (pantalla === 'resultados') {
    return (
      <div className="pantalla">
        <section className="tarjeta">
          <h1 className="titulo-form">Oportunidades para ti</h1>
          <p className="subtitulo-form">
            Resultados seleccionados según tu búsqueda.
          </p>

          <div className="resultados">
            {oportunidades.length === 0 && (
              <p>No encontramos resultados exactos. Intenta ampliar tus filtros.</p>
            )}

            {oportunidades.map((item) => (
              <div className="card" key={item.id}>
                <h3>{item.titulo}</h3>

                <p>{item.descripcion}</p>

                <p>
                  <strong>Compatibilidad:</strong> {item.compatibilidad}%
                </p>

                <p>
                  <strong>Tipo:</strong> {item.tipo}
                </p>

                <p>
                  <strong>País:</strong> {item.pais}
                </p>

                <p>
                  <strong>Modalidad:</strong> {item.modalidad}
                </p>

                <p>
                  <strong>Nivel de inglés:</strong> {item.nivel_ingles}
                </p>

                <a href={item.link} target="_blank" rel="noreferrer">
                  Ver oportunidad
                </a>
              </div>
            ))}
          </div>

          <button className="boton-secundario" onClick={() => setPantalla('registro2')}>
            Editar búsqueda
          </button>

          <button className="boton" onClick={() => setPantalla('inicio')}>
            Nueva búsqueda
          </button>
        </section>
      </div>
    )
  }
}

export default App
