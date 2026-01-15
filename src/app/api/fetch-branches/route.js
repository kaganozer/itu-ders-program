import { NextResponse } from "next/server";

export async function GET() {
    try {
        const educationLevel = "LS"; // TODO: ["OL", "LS", "LU", "LUI"]
        const res = await fetch(`https://obs.itu.edu.tr/public/DersProgram/SearchBransKoduByProgramSeviye?programSeviyeTipiAnahtari=${educationLevel}`);
        const data = await res.json();

        const branches = data
            .map(item => ({ code: item.dersBransKodu, id: item.bransKoduId }))
            .sort((a, b) => a.code.localeCompare(b.code));

        return NextResponse.json(branches);
    }
    catch (error) {
        console.error("Brans listesine ulasilamadi: ", error);
        return NextResponse.json({ "error": "Brans listesine ulasilamadi." }, { status: 500 });
    }
}
