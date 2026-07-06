import Container from "@/components/Container";
import BuyButton from "@/components/pw/BuyButton";
import Arrow from "@/components/pw/Arrow";
import { color1, color2, color3 } from "@/components/pw/colors";
import { MARKETING_LEVELS } from "@/lib/pw-levels";
import type { SublevelDefinition } from "@/lib/pw-levels";

function getLevelColor(levelId: string): string {
  if (levelId.startsWith("3.")) return color3;
  if (levelId.startsWith("2.")) return color2;
  return color1;
}

function LevelConnector({
  fromAnchor,
  toAnchor,
  fromColor,
  toColor,
}: {
  fromAnchor: number;
  toAnchor: number;
  fromColor: string;
  toColor: string;
}) {
  return (
    <div className="relative my-2 h-28 w-full sm:my-3 sm:h-36">
      <Arrow
        startX={fromAnchor}
        startY={6}
        endX={toAnchor}
        endY={74}
        fromColor={fromColor}
        toColor={toColor}
        bend={22}
        strokeWidth={3.5}
        startInset={8}
        endInset={16}
      />
    </div>
  );
}

function LevelBox({ level }: { level: SublevelDefinition }) {
  const groupColor = getLevelColor(level.id);

  return (
    <div
      className="w-full max-w-md rounded-2xl border p-5 sm:p-6"
      style={{ borderColor: groupColor, backgroundColor: `${groupColor}14` }}
    >
      <p className="text-sm font-medium" style={{ color: groupColor }}>
        Level {level.id} - {level.timing}
      </p>
      <p className="mt-2 text-base leading-relaxed text-white/90 sm:text-lg">
        {level.content}
      </p>
      {level.showSignUpButton ? (
        <div className="mt-4 flex justify-center">
          <BuyButton
            color={groupColor}
            label="Sign up"
            href="/pw/login?callbackUrl=/dashboard"
          />
        </div>
      ) : null}
    </div>
  );
}

export default function Levels() {
  return (
    <section className="py-6 sm:py-8">
      <Container>
        <div className="mx-auto w-full max-w-3xl">
          {MARKETING_LEVELS.map((level, index) => {
            const groupColor = getLevelColor(level.id);

            return (
              <div key={level.id}>
                <div
                  className="mb-1 w-full max-w-md max-sm:ml-0! sm:mb-2"
                  style={{ marginLeft: `${level.shift ?? 0}%` }}
                >
                  <LevelBox level={level} />
                </div>

                {index < MARKETING_LEVELS.length - 1 ? (
                  <>
                    <div className="sm:hidden">
                      <LevelConnector
                        fromAnchor={50}
                        toAnchor={50}
                        fromColor={groupColor}
                        toColor={getLevelColor(MARKETING_LEVELS[index + 1].id)}
                      />
                    </div>
                    <div className="hidden sm:block">
                      <LevelConnector
                        fromAnchor={level.anchor ?? 50}
                        toAnchor={MARKETING_LEVELS[index + 1].anchor ?? 50}
                        fromColor={groupColor}
                        toColor={getLevelColor(MARKETING_LEVELS[index + 1].id)}
                      />
                    </div>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
