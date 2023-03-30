# Base Path

`/chat-gpt-ai`

# Endpoints

## Generic Davinci Request

`POST /chat-gpt-ai/message`

Body:
`{ question: "string" }`

## Generic WebGPT Request

`POST /chat-gpt-ai/message-gpt`

Body:
`{ question: "string" }`

## Create a sequence of emails

`POST /chat-gpt-ai/create-sequence`

Body:
`{ projectName: "string", jobDescription: "string"}`

## Analyze Profile vs Job Description

`POST /chat-gpt-ai/analyze-profile`

Body:
`{ profile: "string", jobDescription: "string"}`

## Analyze Email Response

`POST /chat-gpt-ai/analyze-response`

Body:
`{ emailResponse: "string" }`

# Optional Parameters

Body:

```
modelId: default('gpt-3.5-turbo')
temperature: default(0.5)
maxTokens: default(2000)
```
