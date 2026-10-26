import type { StaticImageData } from "next/image";

import rivetFullAssembly from "@/assets/projects/rivet-tool/full-assembly.jpg";
import rivetGap from "@/assets/projects/rivet-tool/rivet-gap.jpg";
import rivetPrototypes from "@/assets/projects/rivet-tool/prototypes.jpg";
import rivetCad from "@/assets/projects/rivet-tool/cad-assembly.jpg";
import rivetOperator from "@/assets/projects/rivet-tool/operator.jpg";
import rivetTower from "@/assets/projects/rivet-tool/tower-adapter-arch.jpg";
import rivetBridge from "@/assets/projects/rivet-tool/bridge.jpg";
import rivetBushing from "@/assets/projects/rivet-tool/gun-bushing.jpg";
import maskingUnits from "@/assets/projects/masking-rubber/storage-units.jpg";
import maskingBins from "@/assets/projects/masking-rubber/bins.jpg";
import grinder from "@/assets/projects/grind-procedures/grinder.jpg";
import hornetCad from "@/assets/projects/hornet-coupler/labeled-cad.jpg";
import hornetAssembly from "@/assets/projects/hornet-coupler/integrated-assembly.jpg";
import hornetBending from "@/assets/projects/hornet-coupler/bending-stress.jpg";
import hornetComparison from "@/assets/projects/hornet-coupler/stress-comparison.jpg";
import intrepidRender from "@/assets/projects/intrepid/render.jpg";
import intrepidHeatShrink from "@/assets/projects/intrepid/heat-shrink.jpg";
import intrepidFullStack from "@/assets/projects/intrepid/full-stack.jpg";
import intrepidBooster from "@/assets/projects/intrepid/booster.jpg";
import intrepidNosecone from "@/assets/projects/intrepid/nosecone.jpg";
import craneTeam from "@/assets/projects/crane/gantry-team.jpg";
import craneBuilt from "@/assets/projects/crane/gantry-built.jpg";
import craneCad from "@/assets/projects/crane/gantry-cad.png";
import craneFeaNoStiffener from "@/assets/projects/crane/fea-no-stiffener.jpg";
import craneFeaStiffener from "@/assets/projects/crane/fea-stiffener.jpg";
import craneBeamCalc from "@/assets/projects/crane/ibeam-hand-calc.jpg";
import craneRiggingCalc from "@/assets/projects/crane/rigging-hand-calc.jpg";
import aerosondeStand from "@/assets/projects/aerosonde/test-stand-cad.jpg";
import aerosondeAdapter from "@/assets/projects/aerosonde/adapter-cad.jpg";
import aerosondeFea from "@/assets/projects/aerosonde/bracket-fea.jpg";
import aerosondeMotor from "@/assets/projects/aerosonde/motor-mounted.jpg";
import aerosondeBracket from "@/assets/projects/aerosonde/bracket-installed.jpg";

export type Figure = {
  image: StaticImageData;
  caption: string;
  // Diagrams and renders on white backgrounds: show whole, never cropped.
  diagram?: boolean;
  // As a project page cover, keep the photo's own proportions instead of
  // cropping it to the standard wide frame.
  full?: boolean;
};

export type Takeaway = {
  title: string;
  body: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  organization: string;
  role: string;
  location: string;
  period: string;
  tags: string[];
  cover: Figure;
  // Write-up sections; an empty section is left off the page.
  problem: string[];
  problemList?: string[];
  process: string[];
  processList?: string[];
  solution: string[];
  solutionList?: string[];
  takeaways: Takeaway[];
  gallery: Figure[];
};

const textron = {
  organization: "Textron Systems",
  role: "Mechanical Design Engineering Intern",
  location: "Hunt Valley, MD",
  period: "Jun – Aug 2026",
};

const bell = {
  organization: "Bell Flight",
  role: "Manufacturing Engineering Intern",
  location: "Drive Systems Center, Grand Prairie, TX",
  period: "Jun – Aug 2025",
};

const rocketry = {
  organization: "Texas A&M Sounding Rocketry Team",
  role: "Structures Engineer",
  location: "College Station, TX",
};

export const projects: Project[] = [
  {
    slug: "crane-tethered-lander-gantry",
    title: "C.R.A.N.E.",
    summary:
      "Transport and catch system for a 400 lb propulsive lander. Modified a COTS gantry and used hand calculations and Ansys FEA to find and fix a failing tether interface.",
    ...rocketry,
    period: "Aug 2025 – May 2026",
    tags: ["FEA", "Ansys", "Structural Analysis", "Rocketry"],
    cover: { image: craneTeam, caption: "Raising the gantry" },
    problem: [
      "The Collegiate Propulsive Lander Challenge requires teams to demonstrate a controlled, tethered 10-second hover with payload. That means the vehicle has to fly on a tether, and that tether system has to actually work.",
      "That gave Texas A&M’s Sounding Rocketry Team two parallel needs: a way to safely move a 400 lb Lander Vehicle to and from the test site, and a system that could catch the vehicle mid-flight if something failed, protecting hardware that represents months of work.",
    ],
    process: [
      "I started by researching COTS solutions before committing to a SRAD design. The lead candidate was a Harbor Freight gantry rated to 2,000 lbs static. In parallel, we ran structural calculations and designed stiffness transitions to bring it in line with our critical requirement of a factor of safety of 3, ultimately reaching 2.9.",
      "My main analysis contribution was the tether interface. I measured the I-beam geometry and modeled it by hand as simply supported with a 2,000 lb point load at center, which returned an FOS of 2.5. Validating that in Ansys Static Structural, with fixed boundary conditions and the U-bolt holes included, returned an FOS of 0.97: the I-beam would yield.",
      "Adding a 1/4\" steel stiffener plate beneath the I-beam to locally stiffen the region brought the FOS to 2.75. In the end we dropped the U-bolts for a lifting clamp to avoid drilling the I-beam at all. I then ran hand calculations on the rest of the tether hardware, mainly the rigging, to check each component’s load capacity ahead of testing.",
    ],
    solution: [
      "A modified COTS Harbor Freight gantry with welded stiffness transitions at the I-beam-to-leg interface, paired with a lifting-clamp tether interface. It can transport the 400 lb Lander Vehicle and catch it in a flight failure, engineered for 2,000 lbs of equivalent dynamic load.",
      "The system has been manufactured and is pending live testing.",
    ],
    takeaways: [
      {
        title: "Jump into the deep end",
        body: "I came in with zero FEA experience and first tried to delegate the analysis. On reflection, I was avoiding something that scared me rather than making a real leadership call. I owned it, learned the fundamentals, and made design decisions from my own simulations.",
      },
      {
        title: "Tools are second to engineering judgment",
        body: "FEA gives you a value, not a decision. Every run meant asking whether a stress concentration was a geometry problem or a loading problem, and whether the margin held up given the uncertainty in my inputs. Interrogating the output was the harder, more important skill.",
      },
    ],
    gallery: [
      { image: craneBuilt, caption: "The manufactured gantry" },
      { image: craneCad, caption: "Gantry CAD assembly", diagram: true },
      { image: craneFeaNoStiffener, caption: "FEA without the stiffener plate", diagram: true },
      { image: craneFeaStiffener, caption: "FEA with the stiffener plate", diagram: true },
      { image: craneBeamCalc, caption: "I-beam hand calculation", diagram: true },
      { image: craneRiggingCalc, caption: "Rigging equipment hand calculations", diagram: true },
    ],
  },
  {
    slug: "aerosonde-testing-bracketry",
    title: "Aerosonde Testing Bracketry",
    summary:
      "A single-orientation motor mount and an adjustable Hall effect sensor arm for a motor characterization test stand, checked with Ansys modal and structural analysis.",
    ...textron,
    tags: ["Design", "Ansys", "Sheet Metal", "Test Hardware", "Internship"],
    cover: { image: aerosondeBracket, caption: "Full integrated assembly on the test stand", full: true },
    problem: [
      "Textron Systems had new motor and propeller configurations that needed testing, but there was no way to mount the motors, or the Hall effect sensor the tests depend on, to the test stand.",
    ],
    process: [
      "I started with the motor mount, letting the physical hardware drive the requirements: the mounting pattern on the test stand, the mounting patterns on the motors themselves, and the wiring coming off each motor. We also wanted a single mount for every motor type, so I worked through orientations for each one and built in deliberate asymmetries so the mount could not be installed incorrectly.",
      "The Hall effect sensor mount was the trickier half. The sensor had to sit within 2 mm of the propeller while barely disturbing it, and stay clear of vibration. I first designed an arm that keeps out of the propeller’s way, then a mount that interfaces the sensor with the arm. The mount adjusts so the sensor can be calibrated to each propeller’s depth.",
      "With the design set, I ran modal and structural analysis on the arm in Ansys. The modal analysis confirmed the arm’s natural frequency sits outside the motor’s operating range, and the structural analysis confirmed the arm would not deform if it caught airflow the wrong way and acted like an airfoil. I then produced drawings for the motor mount, arm and sensor mount and sent them out for manufacturing.",
    ],
    solution: ["A three-part mounting system for the motor characterization test stand:"],
    solutionList: [
      "Motor mount: machined from 6061 aluminum, with one mount for every motor type and asymmetries that prevent incorrect installation",
      "Sensor arm: aluminum sheet metal, routed clear of the propeller, with a natural frequency outside the motor’s operating range",
      "Sensor mount: aluminum sheet metal, adjustable to hold the Hall effect sensor within 2 mm of propellers at different depths",
    ],
    takeaways: [
      {
        title: "Simplification follows iteration",
        body: "I often try to land on the best, simplest solution on the first try, and end up stuck analyzing and obsessing over a single design instead of building something that works. Putting a design on paper and iterating on it gets me to a simple solution faster than waiting for the perfect one.",
      },
    ],
    gallery: [
      { image: aerosondeStand, caption: "Test stand CAD", diagram: true },
      { image: aerosondeAdapter, caption: "Motor adapter CAD", diagram: true },
      { image: aerosondeFea, caption: "Modal analysis of the sensor arm", diagram: true },
      { image: aerosondeMotor, caption: "Motor mounted on the test stand" },
    ],
  },
  {
    slug: "407-tail-rotor-rivet-tool",
    title: "407 Tail Rotor Rivet Installation Tool",
    summary:
      "Fixture that locks the 407 tail rotor shaft in place and holds the rivet gun normal to every rivet, taken through four prototype generations in ten weeks.",
    ...bell,
    tags: ["Tooling", "Fusion 360", "3D Printing", "Internship"],
    cover: { image: rivetFullAssembly, caption: "Full assembly on the shop floor" },
    problem: [
      "Quality checks on the 407 Tail Rotor Shaft Assembly found gaps under the rivet heads. The root cause was operator error, so the fix had to be tooling that made quality consistent no matter who was on the gun.",
      "I shadowed the operator to quantify the problem and gather feedback, and broke the vague goal of “reduce gaps under the rivet head” into two concrete issues:",
    ],
    problemList: [
      "Rivet gun alignment: operators had to hand-align a 5 lb rivet gun normal to the rivet head, for more than 100 rivets per order.",
      "Free movement of the shaft: forces from the rivet gun transferred into the shaft, making it kick up and twist out of alignment with the gun.",
    ],
    process: [
      "With those two problems in mind, I iterated through four generations of prototypes over ten weeks, asking for as much feedback and criticism as I could get, adding features as they proved necessary, and simplifying the ones that didn’t.",
    ],
    processList: [
      "Modeled every component and the full assembly in Fusion 360",
      "Printed prototypes on Bambu Lab FDM printers to iterate quickly and verify sizing",
      "Reviewed tail rotor part drawings to size each prototype",
    ],
    solution: [
      "A system that stops the rotor shaft from moving and aligns the rivet gun normal to the rivet. It’s made of four parts:",
    ],
    solutionList: [
      "Arch: aligns the rivet gun with the rivet",
      "Tower Assembly: houses the Adapter and supports the shaft",
      "Adapter: mounts on the tail rotor shaft and interfaces with the Tower",
      "Gun Bushing: fits the rivet gun and interfaces with the Arch to correct alignment",
    ],
    takeaways: [
      {
        title: "Keep it simple",
        body: "It’s tempting to build mechanically complex systems full of features, but they often distract from the actual problem.",
      },
      {
        title: "Don’t reinvent the wheel",
        body: "When I hit a roadblock, someone else had usually faced something similar and already done the grunt work on a solution.",
      },
      {
        title: "Feedback is king",
        body: "Input from the operators who would use the tool every day is what made the solution practical.",
      },
      {
        title: "Iterate, iterate, iterate",
        body: "Ten failed prototypes beat one pretty CAD model. The first gives you ten chances to improve; the second gives you none.",
      },
    ],
    gallery: [
      { image: rivetGap, caption: "Gap under a rivet head (exaggerated)" },
      { image: rivetPrototypes, caption: "Prototypes produced over the internship" },
      { image: rivetCad, caption: "CAD assembly of the full system", diagram: true },
      { image: rivetTower, caption: "Tower Assembly, Adapter and Arch" },
      { image: rivetBridge, caption: "Bridge" },
      { image: rivetBushing, caption: "Gun Bushing" },
      { image: rivetOperator, caption: "Operator shooting rivets with the finished system" },
    ],
  },
  {
    slug: "hornet-coupler-system",
    title: "Hornet Coupler System",
    summary:
      "Composite coupler joining motor casing to airframe on a subminimum-diameter rocket, sized by hand calculations against a 200 lbf snatch load. Four flights, no failures.",
    ...rocketry,
    period: "Aug – Dec 2024",
    tags: ["Composites", "Stress Analysis", "SolidWorks", "Rocketry"],
    cover: { image: hornetCad, caption: "Labeled CAD assembly", diagram: true },
    problem: [
      "Hornet was a developmental rocket for Texas A&M’s SpaceShot program, built to test a subminimum-diameter design. In a minimum-diameter rocket the motor casing simply slides into the body tube. But when the casing is the same diameter as the tube, that isn’t an option. A coupler had to be designed to join the two.",
    ],
    process: [
      "Assuming a worst-case 200 lbf snatch force when the parachute opens, I ran bending and shear calculations in Excel for carbon fiber, fiberglass, PETG and aluminum. Those numbers drove the design choice, since each material dictates a different manufacturing process. I chose the composite design for its simplicity and its margin over the expected flight loads.",
      "I modeled each component and the full assembly in SolidWorks to check dimensions and tolerances, then built it: a wet layup with fiberglass sleeving for the coupler, a water-jet carbon fiber laminate bulkhead, and a 3D-printed PETG centering ring. Along the way I presented the design at weekly meetings and formal design reviews to check my calculations, defend the rationale, and make sure manufacturing went smoothly.",
    ],
    solution: [
      "A composite coupler system epoxied into the airframe, made up of:",
    ],
    solutionList: [
      "Bulkhead: houses the locknut and caps the system",
      "Coupler: the bonding surface",
      "Centering ring: keeps the motor casing and coupler concentric",
      "Locknut and eyebolt: the recovery attachment point",
    ],
    takeaways: [
      {
        title: "The fancy solution isn’t always the best",
        body: "I initially leaned toward an aluminum coupler mostly because it was novel. The stress calculations showed it would add needless complexity to integration and manufacturing.",
      },
      {
        title: "Fall down six times, get up seven",
        body: "My background was 3D printing, so designing and validating a system in materials I’d never used was daunting. I learned fastest once I jumped in and started stumbling responsibly.",
      },
    ],
    gallery: [
      { image: hornetAssembly, caption: "Full integrated assembly, CAD vs. manufactured", diagram: true },
      { image: hornetBending, caption: "Bending stress calculations for the composite coupler", diagram: true },
      { image: hornetComparison, caption: "Bending and shear stress comparison across materials", diagram: true },
    ],
  },
  {
    slug: "intrepid-rocket-manufacturing",
    title: "Intrepid Rocket Manufacturing",
    summary:
      "Fabricated the carbon fiber airframe, nosecone and fins of a two-stage, Mach 2.5 test rocket, and led its final assembly.",
    ...rocketry,
    period: "Jan – Mar 2025",
    tags: ["Carbon Fiber", "Manufacturing", "Rocketry"],
    cover: { image: intrepidHeatShrink, caption: "Securing a pre-preg tube with heat shrink tape" },
    problem: [
      "Intrepid was a developmental two-stage rocket for the SpaceShot program, built to test an interstage coupler design. I was responsible for fabricating the structural components (airframe, nosecone and fins) and for final assembly.",
    ],
    process: [
      "For the booster and sustainer airframes, we rolled pre-impregnated carbon fiber around an aluminum mandrel, secured it with heat shrink tape, and cured the tubes in our composites oven. I made the nosecone with a carbon fiber wet layup over a positive mold using carbon fiber sleeving.",
      "The fins were made by an outside vendor; we epoxied them on, filleted them, and added a tip-to-tip carbon fiber wet layup to strengthen them.",
    ],
    solution: [
      "A two-stage rocket built to withstand speeds up to Mach 2.5. Intrepid flew at the Argonia Cup and validated the interstage coupler design.",
      "It was not recovered. A post-launch failure analysis traced the loss to the staging logic, which fired the sustainer stage right off the rail.",
    ],
    takeaways: [
      {
        title: "Measure twice, cut once",
        body: "A few careless moments in manufacturing forced improvised fixes. They were temporary, but they still lowered the quality of the final product.",
      },
      {
        title: "Take initiative",
        body: "I joined midway through the project and had to learn the systems while building them. The fastest way to catch up was to jump into the work instead of waiting to be told what to do.",
      },
    ],
    gallery: [
      { image: intrepidRender, caption: "Intrepid render", diagram: true },
      { image: intrepidFullStack, caption: "Full stack integration" },
      { image: intrepidBooster, caption: "Booster stage" },
      { image: intrepidNosecone, caption: "Nosecone and part of the sustainer stage" },
    ],
  },
  {
    slug: "masking-rubber-reorganization",
    title: "Masking Rubber Reorganization",
    summary:
      "Inventoried and reorganized 150+ masking rubber types for a copper plating line against three years of forecast demand, freeing three shelves of storage.",
    ...bell,
    tags: ["Process Improvement", "Excel", "Internship"],
    cover: { image: maskingUnits, caption: "The two vertical storage units" },
    problem: [
      "Two vertical storage units hold the masking rubbers used in a copper plating process. Over the years rubbers had been added, removed and misplaced, making the ones you needed hard to find.",
    ],
    process: [
      "I built an Excel inventory of every rubber and its location across both units. A co-intern and I then pulled the expected load of copper-plated parts for 2025–2028 to decide which rubbers could come off the shelves, and checked part planning for special operations such as nitriding and full copper plating. A second spreadsheet laid out and logged the new order.",
    ],
    solution: [
      "Over 150 masking rubber types were reorganized by program and part number in ascending order, with new labels above each bin. We posted an updated catalog and handed the file to the lead engineer so the system would stay maintained. The effort cleared three full shelves.",
    ],
    takeaways: [
      {
        title: "The little things matter",
        body: "Operators thanked us and talked about how much easier it was to find rubbers. It felt like a small project, but it meant a lot to the people who used it every day.",
      },
      {
        title: "The devil’s in the details",
        body: "Working systematically and planning for how the system would be maintained after we left is what made it stick.",
      },
    ],
    gallery: [{ image: maskingBins, caption: "Relabeled bins" }],
  },
  {
    slug: "production-grind-standard-work",
    title: "Production Grind Standard Work Procedures",
    summary:
      "Documented undocumented production grinding setups by shadowing operators, producing 15+ standard work guides used for reference and training.",
    ...bell,
    tags: ["Documentation", "Machining", "Internship"],
    cover: { image: grinder, caption: "Production grind setup" },
    problem: [
      "Knowledge about production grinding was mostly passed from operator to operator with little documentation, which let poor practices creep in and hurt production quality.",
    ],
    process: [
      "I shadowed and worked with production grind operators during part setups, documenting every aspect of each procedure (wheel type, dress type, flag, zero, and headstock and tailstock positions) and turned it into presentation-based guides.",
    ],
    solution: [
      "More than fifteen guides documenting production grind setups and best practices, now used both as a reference and as a training aid for new operators.",
    ],
    takeaways: [
      {
        title: "There’s no such thing as a silly question",
        body: "Machining terminology is easy to get lost in. My work would have suffered more from pretending to understand than from admitting I didn’t.",
      },
      {
        title: "Be a sponge",
        body: "Take notes on everything, ask every question, and take every opportunity to learn. I learned the most by acting like I knew nothing.",
      },
    ],
    gallery: [],
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
