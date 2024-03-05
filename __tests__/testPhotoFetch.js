

fetch("https://lh3.googleusercontent.com/a/ACg8ocL3kSjBslTNoSD-P1rIoIihP_WdPkIR5Bl9cGDmpnMM=s96-c")
    .then(response => response.arrayBuffer()
        .then(blob => {
            const contentType = response.headers.get('content-type');
            const base64String = `data:${contentType};base64,${Buffer.from(blob).toString('base64')}`;
            return base64String;
        }))
    .then(data => {
        console.log(data);
    });