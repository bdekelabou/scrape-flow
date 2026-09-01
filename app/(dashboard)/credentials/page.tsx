import { GetCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { ShieldIcon } from "lucide-react";
import React, { Suspense } from "react";
import CreateCredentialDialog from "./_components/CreateCredentialDialog";
import DeleteCredentialBtn from "./_components/DeleteCredentialBtn";

export default function CredentialsPage() {
  return (
    <div className="flex-1 flex flex-col h-full p-6">
      <div className="flex justify-between items-center pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold">Credentials</h1>
          <p className="text-muted-foreground text-sm">
            Manage your secure API keys and tokens for AI & external integrations
          </p>
        </div>
        <CreateCredentialDialog />
      </div>

      <div className="h-full py-6">
        <Suspense fallback={<div>Loading credentials...</div>}>
          <CredentialsList />
        </Suspense>
      </div>
    </div>
  );
}

async function CredentialsList() {
  const credentials = await GetCredentialsForUser();

  if (credentials.length === 0) {
    return (
      <Alert>
        <ShieldIcon className="h-4 w-4" />
        <AlertTitle>No credentials created yet</AlertTitle>
        <AlertDescription>
          Click the &quot;Create Credential&quot; button above to add your first API key.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {credentials.map((c) => (
        <Card key={c.id} className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-full text-primary">
              <ShieldIcon size={20} />
            </div>
            <div>
              <p className="font-bold text-sm">{c.name}</p>
              <p className="text-xs text-muted-foreground">
                Created: {new Date(c.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <DeleteCredentialBtn name={c.name} />
        </Card>
      ))}
    </div>
  );
}
