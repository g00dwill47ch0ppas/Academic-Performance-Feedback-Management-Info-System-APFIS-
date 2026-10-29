from __future__ import annotations

import argparse
import json
import math
import wave
from pathlib import Path

import numpy as np
from kokoro_onnx import Kokoro


FPS = 30
DURATION_SECONDS = 150

VOICE_SEGMENTS = [
    "Falling behind rarely begins with one moment. It can take shape across the marks already recorded, and the assessments still to come.",
    "Descriptive analytics shows what has happened. Predictive analytics asks what may happen. Prescriptive analytics explores what action could help.",
    "The student assistant starts with an assessment plan. A student records the assessments in their module, then adds marks as they become available.",
    "The academic profile brings the entered marks together as current participation, academic standing, and completed and remaining assessments.",
    "Next, the student explores improvement scenarios. For each feasible plan, the tool shows a target participation mark and the required marks for selected remaining assessments.",
    "The summary brings together marks, profile and scenarios. Students can export assessment data as C. S. V.",
    "The tools remain separate by design. Student workflow data stays in the student tool. Lecturer module data is held separately in memory. They do not share data.",
    "On the lecturer side, a class dashboard summarises participation across the cohort. Its at-risk flag is based on a clear rule: even the best-case mark cannot reach the pass threshold.",
    "On an individual student view, the lecturer can see the feasible range and choose a target within it. The system calculates the minimum mark needed across the remaining assessments.",
    "At cohort level, lecturers explore assessment weights against a target average. The tool shows proposed weights and the result.",
    "Together, these tools support a more proactive approach, making next steps clearer for students and lecturers.",
    "Academic Performance Feedback Management Information System. Gosego Sebaetse. Thamsanqa Ndlakuse.",
]


def write_wav(path: Path, samples: np.ndarray, sample_rate: int) -> None:
    samples = np.asarray(samples, dtype=np.float32)
    if samples.ndim == 1:
        samples = np.column_stack((samples, samples))
    samples = np.clip(samples, -1, 1)
    pcm = (samples * 32767).astype("<i2")
    with wave.open(str(path), "wb") as output:
        output.setnchannels(2)
        output.setsampwidth(2)
        output.setframerate(sample_rate)
        output.writeframes(pcm.tobytes())


def make_music(sample_rate: int = 24000) -> np.ndarray:
    seconds = DURATION_SECONDS
    t = np.arange(seconds * sample_rate, dtype=np.float64) / sample_rate
    audio = np.zeros_like(t)
    chords = [
        (0, 22, [130.81, 164.81, 196.00, 261.63]),
        (22, 44, [110.00, 164.81, 220.00, 261.63]),
        (44, 66, [130.81, 174.61, 196.00, 261.63]),
        (66, 88, [98.00, 146.83, 196.00, 246.94]),
        (88, 110, [130.81, 164.81, 196.00, 261.63]),
        (110, 132, [110.00, 164.81, 220.00, 261.63]),
        (132, 150, [130.81, 164.81, 196.00, 261.63]),
    ]
    for start, end, notes in chords:
        mask = (t >= start) & (t < end)
        local = t[mask] - start
        edge = np.minimum(1.0, local / 2.8) * np.minimum(1.0, (end - start - local) / 3.2)
        pad = np.zeros_like(local)
        for i, hz in enumerate(notes):
            pad += np.sin(2 * math.pi * hz * local + i * 0.17) / (1.0 + i * 0.35)
            pad += 0.16 * np.sin(2 * math.pi * hz * 2 * local + i * 0.1) / (1.0 + i)
        audio[mask] += pad * edge * 0.035

    # Quiet, rounded note attacks add motion without turning the bed into a beat track.
    arpeggio = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63]
    for note_index, start in enumerate(np.arange(3.8, seconds - 2.4, 3.8)):
        first = int(start * sample_rate)
        count = min(int(1.65 * sample_rate), len(audio) - first)
        local = np.arange(count, dtype=np.float64) / sample_rate
        hz = arpeggio[note_index % len(arpeggio)]
        envelope = np.exp(-3.2 * local) * np.minimum(1.0, local / 0.028)
        note = (np.sin(2 * math.pi * hz * local) + 0.23 * np.sin(2 * math.pi * hz * 2 * local))
        audio[first:first + count] += note * envelope * 0.021

    fade_in = np.minimum(1.0, t / 2.5)
    fade_out = np.minimum(1.0, (seconds - t) / 3.5)
    audio *= fade_in * fade_out
    peak = float(np.max(np.abs(audio))) or 1.0
    audio = audio * (0.28 / peak)
    # A slight channel spread keeps the ambience wide but centre-safe.
    stereo = np.column_stack((audio, np.roll(audio, 31)))
    return stereo.astype(np.float32)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--model-dir", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--indices", type=int, nargs="*", help="Only regenerate these one-based narration segment indices")
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    model = args.model_dir / "kokoro-v1.0.int8.onnx"
    voices = args.model_dir / "voices-v1.0.bin"
    if not model.is_file() or not voices.is_file():
        raise FileNotFoundError("Kokoro model files are missing from --model-dir")

    kokoro = Kokoro(str(model), str(voices))
    try:
        for number, text in enumerate(VOICE_SEGMENTS, start=1):
            if args.indices and number not in args.indices:
                continue
            audio, sample_rate = kokoro.create(text, voice="bf_emma", speed=0.91, lang="en-gb")
            audio = np.asarray(audio, dtype=np.float32)
            peak = float(np.max(np.abs(audio))) or 1.0
            audio = audio * min(1.0, 0.82 / peak)
            path = args.output_dir / f"voice-{number:02}.wav"
            write_wav(path, audio, sample_rate)
            duration = len(audio) / sample_rate
            print(f"{path.name}: {duration:.2f}s")
    finally:
        kokoro.voices.close()

    music_path = args.output_dir / "music-bed.wav"
    write_wav(music_path, make_music(), 24000)
    manifest = []
    for number, text in enumerate(VOICE_SEGMENTS, start=1):
        path = args.output_dir / f"voice-{number:02}.wav"
        if not path.is_file():
            raise FileNotFoundError(f"Narration clip is missing: {path}")
        with wave.open(str(path), "rb") as audio_file:
            duration = audio_file.getnframes() / audio_file.getframerate()
        manifest.append({"index": number, "file": path.name, "duration_seconds": round(duration, 3), "voice": "bf_emma", "language": "British English", "text": text})
    (args.output_dir / "voice-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Music: {DURATION_SECONDS}s, original synthesised instrumental bed")


if __name__ == "__main__":
    main()
