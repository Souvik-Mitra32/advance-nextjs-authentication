import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components"

type Props = {
  inviter: { name: string }
  organization: { name: string }
  invitation: { id: string }
}

OrganizationInvitationEmail.PreviewProps = {
  inviter: { name: "Souvik" },
  organization: { name: "ABC org" },
  invitation: { id: "bdgssfdasdadada" },
} satisfies Props

export default function OrganizationInvitationEmail({
  organization,
  inviter,
  invitation,
}: Props) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-[#f6f9fc] py-2.5">
          <Preview>You're invited to join {organization.name}</Preview>
          <Container className="bg-white border border-solid border-[#f0f0f0] p-[45px]">
            <Heading>You're invited to join {organization.name}</Heading>
            <Section>
              <Text className="font-light text-[#404040] leading-[26px]">
                Hello,
              </Text>
              <Text className="font-light text-[#404040] leading-[26px]">
                {inviter.name} invited you to join the organization{" "}
                {organization.name}. Please click the button below to
                accept/reject the invitation.
              </Text>
              <Button
                className="bg-[#00c72b] rounded text-white text-[15px] no-underline text-center block w-[210px] py-[14px] px-[7px]"
                href={`${process.env.BETTER_AUTH_URL}/organizations/invites/${invitation.id}`}
              >
                Manage invitation
              </Button>
              <Text className="font-light text-[#404040] leading-[26px]">
                This link will expire in 24 hours. If you have already joined{" "}
                {organization.name}, just ignore and delete this message.
              </Text>
              <Text className="font-light text-[#404040] leading-[26px]">
                Happy Mastering Better Auth!
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
