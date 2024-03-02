import NotFound from '@/app/not-found'
import BaseUseCaseLanding from '@/components/BaseUseCase.landing'
import FlowCraftTeacher from '@/images/FlowCraft_ForTeachers_Pic.png'
import FlowCraftHealthcare from '@/images/FlowCraft_ForHealthcare_Pic.png'
import FlowCraftStudent from '@/images/FlowCraft_ForStudents_Pic.png'
import FlowCraftEngineer from '@/images/FlowCraft_ForEngineers_Pic.png'
import { landingPageCodeExamples } from '@/lib/react-flow.code'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase-auth/server'
import { redirect } from 'next/navigation'

const props: any = {
  teachers: {
    headline: 'Engage Students, Explain Concepts, and Elevate Learning',
    subheadline: `Teachers, say goodbye to static slides and hello to
  interactive diagrams & charts that bring your lessons to
  life.`,
    ratedBy: `Teachers and Educators`,
    imageSrc: FlowCraftTeacher,
    imageAlt: 'FlowCraft Teacher',
    imageDescription: `FlowCraft diagrams have become my secret weapon for
  simple and effective diagrams. I can tailor visuals to
  different learning styles, and it's like each student
  finally clicks!`,
    imageDescriptionSubtext: 'Mrs. Thompson, 6th Grade Science Teacher',
    contentArea: [
      {
        headline: 'Visually Explain Even the Toughest Topics',
        subheadline: ` Our FlowCraft AI-Assisted diagrams transform complex
      concepts into clear, eye-catching visuals that ignite
      understanding and leave your students saying "Aha!" not
      "Huh?".`,
      },
      {
        headline: 'Boost Engagement and Retention with Interactive Visuals',
        subheadline: `Passive lectures are a thing of the past. Our interactive
      FlowCraft Diagrams, keep students glued to their screens and
      actively participate in their learning journey. Say hello to
      soaring engagement and knowledge retention that sticks!`,
      },
      {
        headline: 'Save Time and Energy with Easy-to-Use Diagrams',
        subheadline: `No more wasting time on complex diagramming tools. Our
      intuitive platform takes your plain text descriptions and
      transforms them into professional diagrams in just minutes.
      No diagramming expertise required!`,
      },
    ],
    ctaHeader: 'Sign up for free and start creating today!',
    ctaSubHeader: 'No credit card required',
    diagramTitle: 'How does the mitochondria work?',
  },
  healthcare: {
    headline: 'Transform Clinical Data into Actionable Insights',
    subheadline: `Empower your practice with Text-to-Diagram and Text-to-Chart AI, streamlining workflows, boosting communication, and enhancing patient care.`,
    ratedBy: `Healthcare Professionals`,
    imageSrc: FlowCraftHealthcare,
    imageAlt: 'FlowCraft Healthcare Professional',
    imageDescription: `Research teams can use FlowCraft AU diagrams & charts to present findings so much more effectively`,
    imageDescriptionSubtext: 'Dr. Lee, Research Scientist',
    contentArea: [
      {
        headline: 'Effortless Visualization',
        subheadline: `Simplify complex data with AI-powered Text-to-Diagram and Text-to-Chart tools. No technical expertise required!`,
      },
      {
        headline: 'Clinical Data Clarity',
        subheadline: `Turn medical reports, patient histories, and research findings into clear, insightful diagrams and charts.`,
      },
      {
        headline: 'Patient Education Made Easy',
        subheadline: `Explain diagnoses, treatment plans, and procedures with engaging visuals that improve patient understanding and adherence.`,
      },
    ],
    ctaHeader: 'Sign up for free and start creating today!',
    ctaSubHeader: 'No credit card required',
    diagramTitle: 'Explain Cardiac Arrest',
  },
  students: {
    headline: 'Ditch Dull Notes, Conquer Complex Concepts',
    subheadline: `Turn any textbook page or any data into a mind-blowing diagram or chart feast with our Text-to-Diagram FlowCraft AI`,
    ratedBy: `Students`,
    imageSrc: FlowCraftStudent,
    imageAlt: 'FlowCraft Student',
    imageDescription: `I used to hate presentations. Now, with FlowCraft Diagrams, I actually look forward to them! My classmates always ask how I make them so awesome.`,
    imageDescriptionSubtext: 'Sarah, 12th Grade History Student',
    contentArea: [
      {
        headline: 'Master Difficult Concepts',
        subheadline: `FlowCraft AI diagrams break down complex concepts into bite-sized visuals, making even the toughest topics crystal clear!`,
      },
      {
        headline: 'Boost Memory and Retention',
        subheadline: `Forget rote memorization! Engaging visuals stick in your brain longer, leading to better grades and a deeper understanding.`,
      },
      {
        headline: 'Study Smarter, Not Harder',
        subheadline: `Save hours creating boring notes. Our AI generates stunning diagrams in seconds, freeing you to focus on learning.`,
      },
    ],
    ctaHeader: 'See how FlowCraft can help you ace your next assignment!',
    ctaSubHeader: 'No credit card required',
    diagramTitle: 'What was the Boston Tea Party?',
  },
  engineers: {
    headline: 'Communicate Ideas, Simplify Workflows, and Boost Productivity',
    subheadline: `Engineers, ditch tedious sketching and unlock the power of instant, intelligent visuals to conquer your biggest challenges.`,
    ratedBy: `Engineers`,
    imageSrc: FlowCraftEngineer,
    imageAlt: 'FlowCraft Engineer',
    imageDescription: `Our team's communication had less issues after we started using FlowCraft diagrams. Everyone's on the same page, and projects move forward smoother than ever.`,
    imageDescriptionSubtext: 'John, Software Engineer',
    contentArea: [
      {
        headline: 'Concept Clarity in Seconds',
        subheadline: `Sketch your ideas, convert them instantly to professional diagrams, and explore design possibilities like never before.`,
      },
      {
        headline: 'Data-Driven Design Decisions',
        subheadline: `Visualize complex data sets and analyze results with AI-Assisted Powerful charting and graphing tools, informing better design choices.`,
      },
      {
        headline: 'Communication Masterclass',
        subheadline: `Communicate your ideas with clarity and precision, and collaborate with your team in real-time to streamline workflows and boost productivity.`,
      },
    ],
    ctaHeader: 'Sign up for free and start creating today!',
    ctaSubHeader: 'No credit card required',
    diagramTitle: 'How does AutoPilot work?',
  },
}

export default async function Page({ params }: { params: { theme: string } }) {
  console.log('Theme: ', params.theme)

  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/')
  }

  if (!props[params.theme]) {
    return (
      <div>
        <NotFound />
      </div>
    )
  }

  return (
    <BaseUseCaseLanding
      headline={props[params.theme].headline}
      subheadline={props[params.theme].subheadline}
      ratedBy={props[params.theme].ratedBy}
      imageSrc={props[params.theme].imageSrc}
      imageAlt={props[params.theme].imageAlt}
      imageDescription={props[params.theme].imageDescription}
      imageDescriptionSubtext={props[params.theme].imageDescriptionSubtext}
      contentArea={props[params.theme].contentArea}
      ctaHeader={props[params.theme].ctaHeader}
      ctaSubHeader={props[params.theme].ctaSubHeader}
      nodes={landingPageCodeExamples[params.theme].nodes}
      edges={landingPageCodeExamples[params.theme].edges}
      diagramTitle={props[params.theme].diagramTitle}
    />
  )
}
