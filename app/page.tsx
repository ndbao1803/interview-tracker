import MainComponent from "./home/mainComponent"
import SharedLayout from "@/components/SharedLayout"

export default async function Index() {
  return (
    <SharedLayout>
      <div className="w-full h-full">
        <MainComponent/>
      </div>
    </SharedLayout>
  )
}
