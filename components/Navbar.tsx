import Image from "next/image"
import Link from "next/link"

const Navbar = () => {
  return (
    <header>
        <nav>
            <Link href="/" className="logo">
                <Image src="/icons/logo.png" alt="logo" height={24} width={24} />
                <p>Dev Events</p>
            </Link>
            <ul>
                <Link href="/">Home</Link>
                <Link href="/events">Events</Link>
                <Link href="/create">Create Events</Link>
            </ul>
        </nav>
    </header>
  )
}

export default Navbar
