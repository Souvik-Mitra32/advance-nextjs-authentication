import Link from "next/link"

export default function HomePage() {
  return (
    <div className="my-6 px-4 max-w-md mx-auto">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Welcome to Our App</h1>
        <Link href="/auth/login">Sign up / Sign in</Link>
      </div>
    </div>
  )
}
