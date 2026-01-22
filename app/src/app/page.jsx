const loadData = async () => {
  const res = await fetch(`${process.env.API_URL}/hello`)

  const resBody = await res.json()

  return resBody
}

export default async function Home() {
  const data = await loadData()

  return (
    <div>
      <main>
        <div>{data.message}</div>
      </main>
    </div>
  )
}
